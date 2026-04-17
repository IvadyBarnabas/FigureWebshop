// Alapadatok - demo termékek
const products = [
    {id:1,name:'Spider-Man Marvel Legends Iron Spider (Aaron Davis) Action Figure',price:15990,category:'Marvel',img:'kepek/Aaron Davis Spiderman.png',stock:5},
    {id:2,name:'Secret Wars Marvel Legends Spider-Man (Alien Costume) Action Figure',price:12990,category:'Marvel',img:'kepek/symbiotespiderman.png',stock:3},
    {id:3,name:'Spider-Man Marvel Legends Retro Collection Spider-Venom Action Figure',price:12990,category:'Marvel',img:'kepek/sym2.png',stock:8},
    {id:4,name:'Marvel Legends Spider-Man Action Figure with Exclusive Magic: The Gathering Card',price:13990,category:'Marvel',img:'kepek/serultspider.png',stock:6},
    {id:5,name:'X-Men 97 Marvel Legends Gambit Action Figure',price:11990,category:'Marvel',img:'kepek/Gambit.png',stock:10},
    {id:6,name:'Marvel Legends Maximum Series Spider-Man Deluxe Action Figure',price:24990,category:'Marvel',img:'kepek/maxsp.png',stock:4},
    {id:7,name:'Spider-Man Marvel Legends Retro Collection Agent Venom (Flash Thompson) Action Figure',price:12990,category:'Marvel',img:'kepek/avenom.png',stock:6},
    {id:8,name:'Spider-Man Marvel Legends Retro Collection Spider-Man 2099 Action Figure',price:13990,category:'Marvel',img:'kepek/2099.png',stock:3},
    {id:9,name:'Marvel Legends Maximum Series Deadpool Action Figure',price:14990,category:'Marvel',img:'kepek/maxdp.png',stock:4},
    {id:10,name:'Spider-Man Marvel Legends Retro Collection Spider-Boy Action Figure',price:11990,category:'Marvel',img:'kepek/SB.png',stock:10},
    {id:11,name:'Marvel Legends Agent Anti-Venom Action Figure with Exclusive Magic: The Gathering Card',price:15990,category:'Marvel',img:'kepek/wavenom.png',stock:4},
    {id:12,name:'Marvel Legends Retro Collection Ghost Rider Action Figure',price:12990,category:'Marvel',img:'kepek/gr.png',stock:6},
    {id:13,name:'Deadpool Corps Marvel Legends Lady Deadpool Action Figure (Marvel\'s Box BAF)',price:12490,category:'Marvel',img:'kepek/ladypool.webp',stock:5},
    {id:14,name:'All-New Ghost Rider Marvel Legends Ghost Rider (Robbie Reyes) Action Figure (Marvel\'s Box BAF)',price:12490,category:'Marvel',img:'kepek/robbie_reyes.webp',stock:5},
    {id:15,name:'Transformers: Age of Extinction Studio Series Voyager Class Optimus Prime Action Figure',price:16990,category:'Transformers',img:'kepek/tf4prime.webp',stock:3},
    {id:16,name:'Transformers: Age of Extinction Studio Series Deluxe Class Bumblebee Action Figure',price:12490,category:'Transformers',img:'kepek/tf4bumblebee.webp',stock:5},
    {id:17,name:'Transformers: Age of Extinction Studio Series Voyager Class Grimlock Action Figure',price:18990,category:'Transformers',img:'kepek/tf4grimlock.webp',stock:2},
    {id:18,name:'Transformers: Age of Extinction Studio Series Deluxe Class Lockdown Action Figure',price:12990,category:'Transformers',img:'kepek/tf4lockdown.webp',stock:5},
    {id:19,name:'Transformers: Age of Extinction Studio Series Voyager Class Drift Action Figure',price:17990,category:'Transformers',img:'kepek/tf4drift.webp',stock:4},
    {id:20,name:'Transformers: Age of Extinction Studio Series Deluxe Class Crosshairs Action Figure',price:11990,category:'Transformers',img:'kepek/tf4crosshairs.webp',stock:6}

  ];

// Állapot
let state = {
  products: [...products],
  cart: {},
  categories: [],
  filter: {category:'all',q:'',sort:'default'}
};

// DOM elemek
const productsEl = document.getElementById('products');
const categorySelect = document.getElementById('categorySelect');
const categoryTags = document.getElementById('categoryTags');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sortSelect');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkout');

// Modal elemek
const productModal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalCategory = document.getElementById('modalCategory');
const modalPrice = document.getElementById('modalPrice');
const modalStock = document.getElementById('modalStock');
const modalDesc = document.getElementById('modalDesc');
const modalQty = document.getElementById('modalQty');
const modalAddBtn = document.getElementById('modalAddBtn');
let currentModalProductId = null;

// Bezáró eseménykezelők a modalhoz
modalClose.addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', closeProductModal);
// Escape billentyűvel is bezárható
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (productModal && !productModal.classList.contains('hidden')) closeProductModal();
  }
});

// Inicializálás
function init(){
  state.categories = Array.from(new Set(state.products.map(p=>p.category)));
  renderCategories();
  renderProducts();
  loadCartFromStorage();
  attachEvents();
}

function renderCategories(){
  // select
  categorySelect.innerHTML = '<option value="all">Összes kategória</option>' + state.categories.map(c=>`<option value="${c}">${c}</option>`).join('');
  // tags
  categoryTags.innerHTML = '<button class="btn ghost" data-cat="all">Összes</button>' + state.categories.map(c=>`<button class="btn ghost" data-cat="${c}">${c}</button>`).join('');
}

function renderProducts(){
  let list = state.products.filter(p=>{
    if(state.filter.category!=='all' && p.category!==state.filter.category) return false;
    if(state.filter.q && !p.name.toLowerCase().includes(state.filter.q.toLowerCase())) return false;
    return true;
  });

  if(state.filter.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(state.filter.sort==='price-desc') list.sort((a,b)=>b.price-a.price);

  productsEl.innerHTML = list.map(p=>`
    <article class="card" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} • Készlet: ${p.stock}</div>
      <div class="price">${p.price.toLocaleString('hu-HU')} Ft</div>
      <div class="actions">
        <button class="btn" data-action="view">Megtekint</button>
        <button class="btn primary" data-action="add">Kosárba</button>
      </div>
    </article>
  `).join('');
}

function attachEvents(){
  categorySelect.addEventListener('change',e=>{state.filter.category=e.target.value;renderProducts();});
  sortSelect.addEventListener('change',e=>{state.filter.sort=e.target.value;renderProducts();});
  searchInput.addEventListener('input',debounce(e=>{state.filter.q=e.target.value;renderProducts();},300));
  categoryTags.addEventListener('click',e=>{if(e.target.dataset.cat){state.filter.category=e.target.dataset.cat;categorySelect.value=e.target.dataset.cat;renderProducts();}});

  productsEl.addEventListener('click',e=>{
    const card = e.target.closest('.card'); if(!card) return; const id = Number(card.dataset.id); const action = e.target.dataset.action;
    if(action==='add') addToCart(id);
    if(action==='view') openProductModal(id);
  });

  cartBtn.addEventListener('click',openCart);
  closeCart.addEventListener('click',closeCartDrawer);
  overlay.addEventListener('click',closeCartDrawer);
  clearCartBtn.addEventListener('click',clearCart);
  checkoutBtn.addEventListener('click',checkout);
}

// Megtekintés - modal megnyitása
function openProductModal(id){
  const p = state.products.find(x=>x.id===id); if(!p) return;
  currentModalProductId = id;
  modalImg.src = p.img;
  modalImg.alt = p.name;
  modalName.textContent = p.name;
  modalCategory.textContent = p.category;
  modalPrice.textContent = p.price.toLocaleString('hu-HU') + ' Ft';
  modalStock.textContent = 'Készlet: ' + p.stock;
  modalDesc.textContent = p.description || 'Nincs részletes leírás.';
  modalQty.value = 1;
  productModal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
  productModal.setAttribute('aria-hidden','false');
  // jelöljük a body-n, hogy modal nyitva van (így CSS-sel elrejthetünk elemeket)
  document.body.classList.add('product-modal-open');
}

function closeProductModal(){
  productModal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
  productModal.setAttribute('aria-hidden','true');
  currentModalProductId = null;
  // eltávolítjuk a body osztályt
  document.body.classList.remove('product-modal-open');
}

// kosárba adás a modalból
modalAddBtn.addEventListener('click',()=>{
  const qty = Math.max(1,Number(modalQty.value)||1);
  if(currentModalProductId) {
    const p = state.products.find(x=>x.id===currentModalProductId);
    if(qty > p.stock){alert('Nincs ennyi készlet');return}
    const cur = state.cart[currentModalProductId] || {...p,qty:0};
    cur.qty = Math.min(p.stock,cur.qty + qty);
    state.cart[currentModalProductId]=cur; saveCart(); renderCart(); updateCartCount(); closeProductModal();
  }
});

function addToCart(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  const current = state.cart[id] || { ...p, qty:0 };
  if(current.qty + 1 > p.stock){alert('Nincs elég készlet');return}
  current.qty +=1; state.cart[id]=current; saveCart(); renderCart(); updateCartCount();}

function renderCart(){
  const items = Object.values(state.cart);
  cartItemsEl.innerHTML = items.map(it=>`
    <div class="cart-item" data-id="${it.id}">
      <img src="${it.img}" alt="${it.name}">
      <div style="flex:1">
        <div><strong>${it.name}</strong></div>
        <div class="meta">${it.category}</div>
        <div class="qty">
          <button data-action="dec">-</button>
          <div style="min-width:28px;text-align:center">${it.qty}</div>
          <button data-action="inc">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>${(it.price*it.qty).toLocaleString('hu-HU')} Ft</div>
        <button class="btn ghost" data-action="remove">Töröl</button>
      </div>
    </div>
  `).join('');

  // események a kosár elemein
  cartItemsEl.querySelectorAll('.cart-item').forEach(el=>{
    el.addEventListener('click',e=>{
      const id = Number(el.dataset.id); const action = e.target.dataset.action;
      if(!action) return;
      if(action==='inc') changeQty(id,1);
      if(action==='dec') changeQty(id,-1);
      if(action==='remove') removeFromCart(id);
    });
  });

  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  cartTotalEl.textContent = total.toLocaleString('hu-HU') + ' Ft';
}

function changeQty(id,delta){
  const item = state.cart[id]; if(!item) return; if(item.qty+delta<1){delete state.cart[id];} else if(item.qty+delta>item.stock){alert('Nincs több raktáron');return}else{item.qty+=delta}
  saveCart(); renderCart(); updateCartCount();}

function removeFromCart(id){delete state.cart[id]; saveCart(); renderCart(); updateCartCount();}

function updateCartCount(){const count=Object.values(state.cart).reduce((s,i)=>s+i.qty,0);cartCount.textContent=count}

function openCart(){cartDrawer.classList.add('open');overlay.classList.remove('hidden');cartDrawer.setAttribute('aria-hidden','false');renderCart();}
function closeCartDrawer(){cartDrawer.classList.remove('open');overlay.classList.add('hidden');cartDrawer.setAttribute('aria-hidden','true');}

function clearCart(){if(!confirm('Biztosan üríted a kosarat?')) return;state.cart={};saveCart();renderCart();updateCartCount();}

function checkout(){
  const total = Object.values(state.cart).reduce((s,i)=>s+i.price*i.qty,0);
  if(total===0){
    alert('A kosár üres');
    return;
  }
  // Biztosítjuk, hogy a kosár el van mentve, majd átirányítjuk a fizetési oldalra
  saveCart();
  window.location.href = 'payment.html';
}

function saveCart(){localStorage.setItem('cart',JSON.stringify(state.cart));}
function loadCartFromStorage(){const raw=localStorage.getItem('cart'); if(raw){try{state.cart=JSON.parse(raw)}catch(e){state.cart={}}} updateCartCount();}

function debounce(fn,ms){let t;return (...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms)}}

init();
