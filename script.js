// Cek login
if (!localStorage.getItem('g_token')) {
  window.location.href = 'index.html';
}

// Tampilkan info user
const email = localStorage.getItem('user_email');
const name = localStorage.getItem('user_name');
document.getElementById('userInfo').textContent = name + ' (' + email + ')';

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
  
  tampilkanPesan(pesan, 'user');
  input.value = '';
  
  sendBtn.disabled = true;
  sendBtn.textContent = 'Mengirim...';
  
  chatHistory.push({ role: 'user', text: pesan });
  
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'chat',
      message: pesan,
      history: chatHistory.slice(-6),
      token: localStorage.getItem('g_token')
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      tampilkanPesan(data.reply, 'bot');
      chatHistory.push({ role: 'bot', text: data.reply });
    } else {
      tampilkanPesan('Error: ' + (data.error || 'Gagal memproses'), 'bot');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    tampilkanPesan('Maaf, terjadi kesalahan koneksi. Silakan coba lagi.', 'bot');
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

function logout() {
  localStorage.removeItem('g_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  window.location.href = 'index.html';
}