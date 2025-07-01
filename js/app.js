const API_URL = 'https://rifkira.psl17.my.id/api';

// =====================
// REGISTER FORM
// =====================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      document.getElementById('response').innerText = result.message || result.error || 'Gagal daftar';
    } catch (err) {
      document.getElementById('response').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// LOGIN FORM
// =====================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.token) {
        localStorage.setItem('token', result.token);
        document.getElementById('response').innerText = 'Login berhasil!';
        // window.location.href = 'dashboard.html';
      } else {
        document.getElementById('response').innerText = result.error || 'Gagal login';
      }
    } catch (err) {
      document.getElementById('response').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// TAMPILKAN PRODUK
// =====================
const produkList = document.getElementById('produkList');
if (produkList) {
  fetch(`${API_URL}/products`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token') // jika endpoint butuh token
    }
  })
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.warn('⚠️ Data produk bukan array:', data);
        produkList.innerHTML = '<p style="color:red;">Produk tidak tersedia</p>';
        return;
      }

      produkList.innerHTML = data.map(p => `
        <div class="produk-card" style="border:1px solid #ddd;padding:10px;margin:10px;">
          <h4>${p.nama_produk}</h4>
          <p>Harga: Rp${Number(p.harga).toLocaleString('id-ID')}</p>
        </div>
      `).join('');
    })
    .catch(err => {
      produkList.innerHTML = '<p style="color:red;">Gagal ambil produk: ' + err.message + '</p>';
    });
}
