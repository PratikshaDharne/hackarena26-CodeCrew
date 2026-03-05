import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ReceiptRow {
  id: string;
  store_name: string | null;
  purchase_date: string | null;
  total_amount: number | null;
  tax: number | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  receipt_items: { id: string; item_name: string; price: number; category: string | null }[];
}

export function useReceipts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["receipts", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ReceiptRow[]> => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*, receipt_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as ReceiptRow[];
    },
  });
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "hsl(160, 84%, 39%)",
  Travel: "hsl(200, 80%, 50%)",
  Shopping: "hsl(280, 70%, 55%)",
  Medical: "hsl(340, 75%, 55%)",
  Education: "hsl(35, 90%, 55%)",
  Bills: "hsl(210, 60%, 50%)",
  Entertainment: "hsl(300, 60%, 55%)",
};

export const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍕",
  Travel: "✈️",
  Shopping: "🛍️",
  Medical: "💊",
  Education: "📚",
  Bills: "📄",
  Entertainment: "🎮",
};
