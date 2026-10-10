const products = [
  { id: 'blue-hour', name: 'Blue Hour Wallpapers', category: 'wallpaper', label: 'WALLPAPER', badge: 'BESTSELLER', description: '12 wallpaper langit & laut, resolusi 4K.', price: 49000, oldPrice: 69000, rating: '4.9', image: 'https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=800&q=82', file: 'blue-hour-wallpapers.zip' },
  { id: 'aqua-dreams', name: 'Aqua Dreams Vol. 1', category: 'sound', label: 'SOUNDSCAPE', badge: 'NEW', description: 'Suara air tenang untuk fokus dan rehat.', price: 35000, rating: '4.8', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=82', file: 'aqua-dreams-vol-1.zip' },
  { id: 'good-morning', name: 'Good Morning UI Kit', category: 'design', label: 'FIGMA · 48 SCREENS', badge: 'POPULAR', description: 'Interface cerah untuk ide yang segar.', price: 129000, oldPrice: 159000, rating: '5.0', image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=82', file: 'good-morning-ui-kit.zip' },
  { id: 'soft-focus', name: 'Soft Focus Presets', category: 'design', label: 'LIGHTROOM · 16 PRESETS', badge: '', description: 'Cahaya lembut dan hijau yang hidup.', price: 59000, rating: '4.9', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=82', file: 'soft-focus-presets.zip' },
  { id: 'cloud-nine', name: 'Cloud Nine Wallpapers', category: 'wallpaper', label: 'WALLPAPER', badge: '', description: '10 langit pastel untuk layar favoritmu.', price: 39000, rating: '4.7', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=82', file: 'cloud-nine-wallpapers.zip' },
  { id: 'ocean-breath', name: 'Ocean Breath', category: 'sound', label: 'SOUNDSCAPE · 45 MIN', badge: '', description: 'Gelombang lembut, tanpa suara yang mengganggu.', price: 29000, rating: '4.8', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=82', file: 'ocean-breath.zip' },
  { id: 'sunny-icons', name: 'Sunny Side Icon Set', category: 'design', label: 'FIGMA · 180 ICONS', badge: 'BUNDLE', description: 'Ikon glossy untuk project yang ceria.', price: 79000, rating: '4.9', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=82', file: 'sunny-side-icons.zip' },
  { id: 'tropical-blues', name: 'Tropical Blues Pack', category: 'wallpaper', label: 'WALLPAPER · 4K', badge: '', description: 'Warna tropis yang bikin desktop bernapas.', price: 45000, rating: '4.8', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=82', file: 'tropical-blues-pack.zip' }
];

const rupiah = amount => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
const productGrid = document.querySelector('#product-grid');
const cartDrawer = document.querySelector('#cart-drawer');
const cartBackdrop = document.querySelector('.drawer-backdrop');
const toast = document.querySelector('#toast');
const memoryBoard = document.querySelector('#memory-board');
const rewardGift = { name: 'Sunny Sticker Pack', file: 'sunny-sticker-pack.zip' };
const memorySymbols = ['☀️', '🌿', '☁️', '🌈', '🌼', '🫧'];
let activeCategory = 'all';
let cart = loadCart();
let gameReward = loadGameReward();
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCount = 0;
let gameStarted = false;
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('aerogarden-cart') || '[]');
    return Array.isArray(saved) ? saved.filter(item => products.some(product => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem('aerogarden-cart', JSON.stringify(cart));
}

function loadGameReward() {
  try {
    const saved = JSON.parse(localStorage.getItem('aerogarden-game-reward') || 'null');
    return saved && saved.claimed === true && typeof saved.code === 'string' ? saved : null;
  } catch {
    return null;
  }
}

function saveGameReward() {
  localStorage.setItem('aerogarden-game-reward', JSON.stringify(gameReward));
}

function productCard(product, index) {
  const badgeClass = product.badge === 'POPULAR' ? 'product-badge popular' : 'product-badge';
  return `<article class="product-card" style="animation-delay:${index * 45}ms">
    <div class="product-art"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="${badgeClass}" ${product.badge ? '' : 'hidden'}>${product.badge}</span><button class="quick-add" type="button" data-add="${product.id}" aria-label="Tambah ${product.name} ke keranjang"><span aria-hidden="true">+</span></button></div>
    <div class="product-info"><div class="product-meta"><span>${product.label}</span><span class="product-rating">★ ${product.rating}</span></div><h3 class="product-name">${product.name}</h3><p class="product-description">${product.description}</p><div class="product-price">${rupiah(product.price)} ${product.oldPrice ? `<s>${rupiah(product.oldPrice)}</s>` : ''}</div></div>
  </article>`;
}

function renderProducts() {
  const query = document.querySelector('#product-search').value.trim().toLocaleLowerCase('id');
  const matches = products.filter(product => {
    const categoryMatches = activeCategory === 'all' || product.category === activeCategory;
    const queryMatches = `${product.name} ${product.description} ${product.label}`.toLocaleLowerCase('id').includes(query);
    return categoryMatches && queryMatches;
  });
  productGrid.innerHTML = matches.map(productCard).join('');
  document.querySelector('#empty-results').hidden = matches.length !== 0;
  productGrid.hidden = matches.length === 0;
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0);
}

function cartDiscount() {
  return gameReward ? Math.round(cartSubtotal() * 0.1) : 0;
}

function cartTotal() {
  return cartSubtotal() - cartDiscount();
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.cart-count').textContent = itemCount;
  document.querySelector('.drawer-count').textContent = `(${itemCount})`;
  document.querySelector('#cart-subtotal').textContent = rupiah(cartSubtotal());
  document.querySelector('#cart-discount-row').hidden = !gameReward;
  document.querySelector('#cart-discount').textContent = `−${rupiah(cartDiscount())}`;
  document.querySelector('#cart-total').textContent = rupiah(cartTotal());
  document.querySelector('#cart-empty').classList.toggle('visible', cart.length === 0);
  document.querySelector('#drawer-bottom').classList.toggle('is-hidden', cart.length === 0);
  document.querySelector('#cart-items').innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    return `<div class="cart-row"><img src="${product.image}" alt=""><div><div class="cart-row-category">${product.label}</div><div class="cart-row-name">${product.name}</div><div class="cart-row-price">${rupiah(product.price * item.quantity)}</div><div class="quantity-control"><button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Kurangi ${product.name}">−</button><span>${item.quantity}</span><button type="button" data-quantity="${product.id}" data-change="1" aria-label="Tambah ${product.name}">+</button></div></div><button class="remove-item" type="button" data-remove="${product.id}" aria-label="Hapus ${product.name}">×</button></div>`;
  }).join('');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}

function addToCart(id) {
  const item = cart.find(entry => entry.id === id);
  if (item) item.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart();
  renderCart();
  showToast(`${getProduct(id).name} ditambahkan ke bag`);
}

function setQuantity(id, change) {
  cart = cart.map(item => item.id === id ? { ...item, quantity: item.quantity + change } : item).filter(item => item.quantity > 0);
  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartBackdrop.hidden = false;
  document.body.classList.add('drawer-active');
  document.querySelector('.close-cart').focus();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartBackdrop.hidden = true;
  document.body.classList.remove('drawer-active');
}

function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  renderCheckout('details');
  document.querySelector('#checkout-dialog').showModal();
}

function renderCheckout(step, extra = {}) {
  const content = document.querySelector('#checkout-content');
  const total = rupiah(cartTotal());
  const checkoutTotal = `<div class="checkout-total-summary"><div class="subtotal-line"><span>Subtotal</span><strong>${rupiah(cartSubtotal())}</strong></div>${gameReward ? `<div class="subtotal-line discount-line"><span>Diskon game (10%)</span><strong>−${rupiah(cartDiscount())}</strong></div>` : ''}<div class="subtotal-line cart-total-line"><span>Total pembayaran</span><strong>${total}</strong></div></div>`;
  if (step === 'details') {
    content.innerHTML = `<div class="checkout-content"><div class="checkout-step">01 / 03 · YOUR DETAILS</div><h2 class="checkout-title" id="checkout-title">Hampir jadi milikmu.</h2><p class="checkout-lead">Isi detail untuk menerima link download produk digitalmu.</p><form id="customer-form"><div class="checkout-fields"><label class="checkout-field full">Nama lengkap<input name="name" autocomplete="name" placeholder="Nama kamu" required minlength="2"></label><label class="checkout-field">Email<input name="email" type="email" autocomplete="email" placeholder="kamu@email.com" required></label><label class="checkout-field">Nomor WhatsApp <span>(opsional)</span><input name="phone" type="tel" autocomplete="tel" placeholder="08xx xxxx xxxx"></label></div>${checkoutTotal}<button class="button button-primary dialog-action" type="submit">Pilih metode pembayaran <span aria-hidden="true">↗</span></button><p class="demo-footnote">Demo checkout · data hanya disimpan di sesi browser ini.</p></form></div>`;
    content.querySelector('#customer-form').addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      renderCheckout('method', { name: formData.get('name').trim(), email: formData.get('email').trim(), phone: formData.get('phone').trim() });
    });
    return;
  }
  if (step === 'method') {
    content.innerHTML = `<div class="checkout-content"><div class="checkout-step">02 / 03 · PAYMENT METHOD</div><h2 class="checkout-title" id="checkout-title">Pilih cara bayar.</h2><p class="checkout-lead">Pesanan untuk ${escapeHtml(extra.name)} · receipt ke ${escapeHtml(extra.email)}</p><form id="payment-form"><div class="payment-list"><label class="payment-option"><input type="radio" name="payment" value="qris" checked><span><span class="payment-name">QRIS</span><span class="payment-hint">Scan dari aplikasi pembayaran favoritmu</span></span><span class="payment-logo">QR</span></label><label class="payment-option"><input type="radio" name="payment" value="bank"><span><span class="payment-name">Transfer bank</span><span class="payment-hint">BCA · Mandiri · BNI · BRI</span></span><span class="payment-logo">BANK</span></label><label class="payment-option"><input type="radio" name="payment" value="ewallet"><span><span class="payment-name">E-wallet</span><span class="payment-hint">GoPay · OVO · DANA · ShopeePay</span></span><span class="payment-logo">WALLET</span></label></div>${checkoutTotal}<button class="button button-primary dialog-action" type="submit">Buat instruksi pembayaran <span aria-hidden="true">↗</span></button><button class="text-button" type="button" data-back-details>← Kembali ke detail</button></form><p class="demo-footnote">Mode simulasi untuk demo. Tidak ada uang yang diproses.</p></div>`;
    content.querySelector('#payment-form').addEventListener('submit', event => {
      event.preventDefault();
      const payment = new FormData(event.currentTarget).get('payment');
      renderCheckout('payment', { ...extra, payment, orderId: `AG${Date.now().toString().slice(-8)}` });
    });
    content.querySelector('[data-back-details]').addEventListener('click', () => renderCheckout('details'));
    return;
  }
  if (step === 'payment') {
    const names = { qris: 'QRIS', bank: 'Transfer bank', ewallet: 'E-wallet' };
    const instructions = {
      qris: 'Di transaksi sungguhan, kode QRIS resmi akan muncul di sini. Untuk demo, lanjutkan dengan tombol simulasi di bawah.',
      bank: 'Di transaksi sungguhan, nomor virtual account akan dibuat otomatis. Untuk demo, lanjutkan dengan tombol simulasi di bawah.',
      ewallet: 'Di transaksi sungguhan, kamu akan diarahkan ke aplikasi e-wallet. Untuk demo, lanjutkan dengan tombol simulasi di bawah.'
    };
    content.innerHTML = `<div class="checkout-content"><div class="checkout-step">03 / 03 · PAYMENT INSTRUCTIONS</div><h2 class="checkout-title" id="checkout-title">Selesaikan pembayaran.</h2><p class="checkout-lead">Metode: ${names[extra.payment]} · Berlaku selama 15 menit</p><div class="order-reference"><span>NOMOR PESANAN</span><strong>${extra.orderId}</strong></div>${extra.payment === 'qris' ? '<div class="qr-placeholder" aria-label="Placeholder QR code simulasi">DEMO QRIS</div>' : ''}<p class="payment-notice">${instructions[extra.payment]} Pembayaran pada halaman ini hanya simulasi.</p>${checkoutTotal}<button class="button button-primary dialog-action" type="button" data-mark-paid>Simulasikan pembayaran berhasil <span aria-hidden="true">✓</span></button><p class="demo-footnote">Tombol ini tidak menghubungi bank, dompet digital, atau payment gateway.</p></div>`;
    content.querySelector('[data-mark-paid]').addEventListener('click', () => renderCheckout('success', extra));
    return;
  }
  const downloads = cart.map(item => {
    const product = getProduct(item.id);
    return `<div class="download-item"><span>${product.name}</span><a href="${makeDemoDownload(product)}" download="${product.file}">Download ↗</a></div>`;
  }).join('') + (gameReward ? `<div class="download-item"><span>Bonus: ${rewardGift.name}</span><a href="${makeDemoDownload({ name: rewardGift.name })}" download="${rewardGift.file}">Download ↗</a></div>` : '');
  content.innerHTML = `<div class="checkout-content"><div class="success-mark" aria-hidden="true">✓</div><div class="checkout-step">ORDER COMPLETE · DEMO</div><h2 class="checkout-title" id="checkout-title">Your little world is ready.</h2><p class="checkout-lead">Simulasi berhasil, ${escapeHtml(extra.name)}. Order <strong>${extra.orderId}</strong> untuk demo ini sudah selesai.</p><div class="download-list">${downloads}</div><p class="payment-notice">Ini adalah konfirmasi demo. Tidak ada pembayaran nyata dan file yang diunduh hanya placeholder bukti alur.</p><button class="button button-primary dialog-action" type="button" data-finish>Kembali ke toko <span aria-hidden="true">↗</span></button><p class="demo-footnote">Untuk menjual sungguhan, hubungkan backend dan akun payment gateway terverifikasi.</p></div>`;
  content.querySelector('[data-finish]').addEventListener('click', finishCheckout);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function makeDemoDownload(product) {
  const content = `Aerogarden demo download placeholder\nProduct: ${product.name}\nThis is not the production product file.`;
  return `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
}

function finishCheckout() {
  cart = [];
  saveCart();
  renderCart();
  document.querySelector('#checkout-dialog').close();
  showToast('Sampai jumpa di bawah langit biru!');
}

function renderMemoryBoard() {
  memoryBoard.innerHTML = memoryCards.map((symbol, index) => {
    const isMatched = memoryCards.matched.includes(index);
    const isFlipped = flippedCards.includes(index) || isMatched;
    return `<button class="memory-card${isFlipped ? ' is-flipped' : ''}${isMatched ? ' is-matched' : ''}" type="button" data-memory-card="${index}" aria-label="${isFlipped ? `Kartu ${symbol}` : `Kartu tertutup ${index + 1}`}" ${isFlipped || flippedCards.length === 2 ? 'disabled' : ''}><span aria-hidden="true">${isFlipped ? symbol : '✳'}</span></button>`;
  }).join('');
  document.querySelector('#memory-moves').textContent = moveCount;
  document.querySelector('#memory-progress').textContent = `${matchedPairs} / ${memorySymbols.length} pasangan`;
}

function startMemoryGame() {
  if (gameReward) return;
  memoryCards = [...memorySymbols, ...memorySymbols].sort(() => Math.random() - 0.5);
  memoryCards.matched = [];
  flippedCards = [];
  matchedPairs = 0;
  moveCount = 0;
  gameStarted = true;
  document.querySelector('#memory-status').textContent = 'Cari pasangan gambar yang sama.';
  document.querySelector('#memory-start').textContent = 'Mulai ulang';
  document.querySelector('#memory-reward').hidden = true;
  renderMemoryBoard();
}

function claimMemoryReward() {
  gameReward = { claimed: true, discount: 10, code: `AERO10-${Math.random().toString(36).slice(2, 8).toUpperCase()}` };
  saveGameReward();
  renderCart();
  document.querySelector('#memory-status').textContent = 'Yeay, semua pasangan ditemukan!';
  document.querySelector('#memory-start').disabled = true;
  document.querySelector('#memory-start').textContent = 'Hadiah sudah diklaim';
  document.querySelector('#memory-reward').innerHTML = `<strong>Hadiah terbuka!</strong><span>Kode ${gameReward.code} memberi diskon 10% di checkout, plus bonus <strong>${rewardGift.name}</strong>.</span>`;
  document.querySelector('#memory-reward').hidden = false;
  showToast('Diskon 10% dan bonus digital berhasil dibuka!');
}

function flipMemoryCard(index) {
  if (!gameStarted || flippedCards.length === 2 || flippedCards.includes(index) || memoryCards.matched.includes(index)) return;
  flippedCards.push(index);
  if (flippedCards.length === 2) {
    moveCount += 1;
    const [first, second] = flippedCards;
    if (memoryCards[first] === memoryCards[second]) {
      memoryCards.matched.push(first, second);
      flippedCards = [];
      matchedPairs += 1;
      renderMemoryBoard();
      if (matchedPairs === memorySymbols.length) claimMemoryReward();
      else document.querySelector('#memory-status').textContent = 'Pasangan cocok! Lanjutkan.';
      return;
    }
    document.querySelector('#memory-status').textContent = 'Belum cocok—coba ingat posisinya.';
    renderMemoryBoard();
    window.setTimeout(() => {
      flippedCards = [];
      renderMemoryBoard();
    }, 750);
    return;
  }
  renderMemoryBoard();
}

function renderSavedReward() {
  if (!gameReward) return;
  document.querySelector('#memory-status').textContent = 'Kamu sudah membuka hadiahnya!';
  document.querySelector('#memory-start').disabled = true;
  document.querySelector('#memory-start').textContent = 'Hadiah sudah diklaim';
  document.querySelector('#memory-reward').innerHTML = `<strong>Hadiahmu menunggu!</strong><span>Kode ${gameReward.code} memberi diskon 10% di checkout, plus bonus <strong>${rewardGift.name}</strong>.</span>`;
  document.querySelector('#memory-reward').hidden = false;
}

function addFloatingBubble() {
  const bubble = document.createElement('button');
  const duration = 11 + Math.random() * 9;
  bubble.className = 'floating-bubble';
  bubble.type = 'button';
  bubble.setAttribute('aria-label', 'Pop gelembung');
  bubble.style.left = `${3 + Math.random() * 94}%`;
  bubble.style.setProperty('--bubble-size', `${20 + Math.random() * 37}px`);
  bubble.style.setProperty('--float-duration', `${duration}s`);
  bubble.style.animationDelay = `-${Math.random() * duration}s`;
  bubble.addEventListener('animationend', () => {
    if (!bubble.classList.contains('is-popping')) {
      bubble.remove();
      addFloatingBubble();
    }
  }, { once: true });
  document.querySelector('#bubble-field').append(bubble);
}

function popBubble(bubble) {
  if (bubble.classList.contains('is-popping')) return;
  bubble.classList.add('is-popping');
  window.setTimeout(() => {
    bubble.remove();
    addFloatingBubble();
  }, 280);
}

document.addEventListener('click', event => {
  const memoryCard = event.target.closest('[data-memory-card]');
  const bubble = event.target.closest('.floating-bubble');
  const addButton = event.target.closest('[data-add]');
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (addButton) addToCart(addButton.dataset.add);
  if (memoryCard) flipMemoryCard(Number(memoryCard.dataset.memoryCard));
  if (bubble) popBubble(bubble);
  if (quantityButton) setQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) setQuantity(removeButton.dataset.remove, -999);
  if (event.target.closest('[data-open-cart]')) openCart();
  if (event.target.closest('[data-close-cart]')) closeCart();
  if (event.target.closest('[data-checkout]')) openCheckout();
  if (event.target.closest('[data-close-checkout]')) document.querySelector('#checkout-dialog').close();
  if (event.target.closest('[data-reset-filters]')) {
    activeCategory = 'all';
    document.querySelector('#product-search').value = '';
    document.querySelectorAll('.category-chip').forEach(button => button.classList.toggle('selected', button.dataset.category === 'all'));
    renderProducts();
  }
});

document.querySelectorAll('.category-chip').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll('.category-chip').forEach(chip => chip.classList.toggle('selected', chip === button));
  renderProducts();
}));
document.querySelector('#product-search').addEventListener('input', renderProducts);
document.querySelector('.search-toggle').addEventListener('click', () => {
  document.querySelector('#product-search').focus();
  document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
});
document.querySelector('#checkout-dialog').addEventListener('click', event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeCart();
});

document.querySelector('#memory-start').addEventListener('click', startMemoryGame);
renderSavedReward();
for (let index = 0; index < 9; index += 1) addFloatingBubble();
renderProducts();
renderCart();