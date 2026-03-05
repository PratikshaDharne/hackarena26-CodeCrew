import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Loader2, Check, Edit3 } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = ["Food", "Travel", "Shopping", "Medical", "Education", "Bills", "Entertainment"] as const;

interface ExtractedData {
  store_name: string;
  purchase_date: string;
  items: { name: string; price: number; category: string }[];
  tax: number;
  total: number;
  category: string;
}

const ScanReceipt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"upload" | "processing" | "review">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData | null>(null);
  const [saving, setSaving] = useState(false);

  const processImage = useCallback(async (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setStep("processing");

    try {
      // Convert to base64
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const { data: result, error } = await supabase.functions.invoke("process-receipt", {
        body: { imageBase64: base64 },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      setData(result);
      setStep("review");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process receipt");
      setStep("upload");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  };

  const handleSave = async () => {
    if (!data || !user) return;
    setSaving(true);

    try {
      // Upload image to storage
      let imageUrl: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("receipt-images").upload(path, imageFile);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("receipt-images").getPublicUrl(path);
          imageUrl = urlData.publicUrl;
        }
      }

      // Insert receipt
      const { data: receipt, error: receiptErr } = await supabase
        .from("receipts")
        .insert({
          user_id: user.id,
          store_name: data.store_name,
          purchase_date: data.purchase_date,
          total_amount: data.total,
          tax: data.tax,
          category: data.category,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (receiptErr) throw receiptErr;

      // Insert items
      if (data.items.length > 0) {
        const { error: itemsErr } = await supabase.from("receipt_items").insert(
          data.items.map((item) => ({
            receipt_id: receipt.id,
            item_name: item.name,
            price: item.price,
            category: item.category,
          }))
        );
        if (itemsErr) throw itemsErr;
      }

      toast.success("Receipt saved!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24 md:pb-8">
        <h1 className="font-display text-2xl font-bold mb-2">Scan Receipt</h1>
        <p className="text-sm text-muted-foreground mb-8">Upload a receipt photo — AI extracts and categorizes everything</p>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`glass-card p-12 text-center border-2 border-dashed transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Drop your receipt here</h3>
              <p className="text-sm text-muted-foreground mb-6">JPG, PNG, or WEBP — max 10MB</p>
              <div className="flex justify-center gap-3">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg text-sm cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" /> Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} capture="environment" />
                </label>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 scan-pulse">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Processing Receipt...</h3>
              <p className="text-sm text-muted-foreground">AI is extracting text and categorizing your expense</p>
            </motion.div>
          )}

          {step === "review" && data && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {imagePreview && (
                <div className="glass-card p-4">
                  <img src={imagePreview} alt="Receipt" className="max-h-48 mx-auto rounded-lg object-contain" />
                </div>
              )}

              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold">Extracted Details</h3>
                  <Edit3 className="w-4 h-4 text-muted-foreground ml-auto" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-muted-foreground">Store Name</label>
                    <input
                      value={data.store_name}
                      onChange={(e) => setData({ ...data, store_name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Date</label>
                    <input
                      type="date"
                      value={data.purchase_date}
                      onChange={(e) => setData({ ...data, purchase_date: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-2 block">Items</label>
                  {data.items.map((item, i) => (
                    <div key={i} className="flex gap-3 mb-2">
                      <input
                        value={item.name}
                        onChange={(e) => {
                          const items = [...data.items];
                          items[i] = { ...items[i], name: e.target.value };
                          setData({ ...data, items });
                        }}
                        className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const items = [...data.items];
                          items[i] = { ...items[i], price: parseFloat(e.target.value) || 0 };
                          setData({ ...data, items });
                        }}
                        className="w-24 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Tax</label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.tax}
                      onChange={(e) => setData({ ...data, tax: parseFloat(e.target.value) || 0 })}
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Total</label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.total}
                      onChange={(e) => setData({ ...data, total: parseFloat(e.target.value) || 0 })}
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Category</label>
                    <select
                      value={data.category}
                      onChange={(e) => setData({ ...data, category: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep("upload"); setData(null); setImageFile(null); setImagePreview(null); }}
                    className="px-5 py-2.5 border border-border text-foreground font-medium rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Expense
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default ScanReceipt;
