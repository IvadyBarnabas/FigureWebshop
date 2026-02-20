// Egyszerű checkout logika: betöltjük a kosarat a localStorage-ból és megjelenítjük az elemeket, számoljuk az összeget
const orderItemsEl = document.getElementById('orderItems');
const orderSubtotalEl = document.getElementById('orderSubtotal');
const orderShippingEl = document.getElementById('orderShipping');
const orderTotalEl = document.getElementById('orderTotal');
const deliveryMethod = document.getElementById('deliveryMethod');
const orderForm = document.getElementById('orderForm');

let cart = {};

function loadCart(){
  const raw = localStorage.getItem('cart');
  if(raw){try{cart = JSON.parse(raw)}catch(e){cart={}}}
  renderOrder();
}

function renderOrder(){
  const items = Object.values(cart);
  if(items.length===0){orderItemsEl.innerHTML='<p>A kosár üres.</p>';}
  else{
    orderItemsEl.innerHTML=items.map(it=>`<div style="display:flex;gap:0.6rem;align-items:center;margin-bottom:0.6rem"><img src="${it.img}" style="width:64px;height:64px;object-fit:cover;border-radius:6px"><div><div><strong>${it.name}</strong></div><div>${it.qty} × ${it.price.toLocaleString('hu-HU')} Ft</div></div></div>`).join('');
  }
  const subtotal = items.reduce((s,i)=>s+i.price*i.qty,0);
  orderSubtotalEl.textContent = subtotal.toLocaleString('hu-HU') + ' Ft';
  updateShipping();
}

function updateShipping(){
  const subtotal = Object.values(cart).reduce((s,i)=>s+i.price*i.qty,0);
  let ship = 0;
  if(deliveryMethod.value==='standard') ship=990;
  if(deliveryMethod.value==='express') ship=1990;
  if(deliveryMethod.value==='pickup') ship=0;
  orderShippingEl.textContent = ship.toLocaleString('hu-HU') + ' Ft';
  orderTotalEl.textContent = (subtotal+ship).toLocaleString('hu-HU') + ' Ft';
}

deliveryMethod.addEventListener('change',updateShipping);

orderForm.addEventListener('submit',e=>{
  e.preventDefault();
  // Egyszerű validálás
  const items = Object.values(cart);
  if(items.length===0){alert('A kosár üres');return}
  alert('Rendelés leadva demo: összeg: '+orderTotalEl.textContent);
  // ürítjük a kosarat demo célból
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
});

loadCart();
