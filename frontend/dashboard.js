// Ensure user is logged in
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

// ===== Upload Receipt =====
const uploadForm = document.getElementById('uploadForm');
if(uploadForm){
    uploadForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const fileInput = document.getElementById('receiptFile');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const res = await fetch('http://127.0.0.1:5000/upload-receipt', {method:'POST', body:formData});
            const data = await res.json();

            document.getElementById('text').textContent = data.text || '-';
            document.getElementById('amount').textContent = data.amount || 0;
            document.getElementById('category').textContent = data.category || '-';
            document.getElementById('result').classList.remove('hidden');

            // Update dashboard charts / budget after upload
            fetchExpenses();
            fetchPrediction();
            fetchBudgetStatus();

        } catch (err) {
            console.error(err);
        }
    });
}

// ===== Logout =====
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// ===== Charts, Budget & Prediction functions =====
fetchExpenses();
fetchPrediction();
fetchBudgetStatus();