// Riwayat chat
let chatHistory = [];

function handleEnter(event) {
  if (event.key === 'Enter') {
    kirimPesan();
  }
}

function kirimPesan() {
  const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const pesan = input.value.trim();
  
  if (!pesan) return;
  
  // Tampilkan pesan user
  tampilkanPesan(pesan, 'user');
  input.value = '';
  
  // Disable button saat loading
  sendBtn.disabled = true;
  sendBtn.textContent = 'Mengirim...';
  
  // Simpan ke history
  chatHistory.push({ role: 'user', text: pesan });
  
  // Kirim ke Apps Script
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'chat',
      message: pesan,
      history: chatHistory.slice(-6) // Kirim 6 pesan terakhir
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      tampilkanPesan(data.reply, 'bot');
      chatHistory.push({ role: 'bot', text: data.reply });
    } else {
      tampilkanPesan('⚠️ Error: ' + (data.error || 'Gagal memproses'), 'bot');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    tampilkanPesan('⚠️ Maaf, terjadi kesalahan koneksi. Silakan coba lagi.', 'bot');
  })
  .finally(() => {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Kirim';
  });
}

function tampilkanPesan(teks, pengirim) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + pengirim;
  messageDiv.innerHTML = teks.replace(/\n/g, '<br>');
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
