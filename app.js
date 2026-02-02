// ========= Utils =========
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

const formatPYG = (n) =>
  new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    maximumFractionDigits: 0
  }).format(n);

// Links
const DELIVERY_URL =
  "https://www.pedidosya.com.py/restaurantes/asuncion/la-math-burger-6a16a68d-0ffa-40f1-9aeb-133d5d4a15d4-menu";
const INSTAGRAM_URL = "https://www.instagram.com/lamathburger/?hl=en";

// ========= Menú (TODO ACÁ ADENTRO) =========
const MENU_ITEMS = [
  // =======================
  // COMBOS
  // =======================
  {
    id: "com-01",
    name: "Box Mini Burgers",
    category: "Combos",
    desc:
      "4 mini burgers (2 cheese, 1 cheese bacon, 1 tasty). Incluye papas fritas y gaseosa 250 ml. (Las hamburguesas no pueden modificarse.)",
    price: 60000,
    img: "combominis.png",
    tag: "Más vendido"
  },

  // =======================
  // ESPECIALES
  // =======================
  {
    id: "esp-01",
    name: "4x4 Animal Style",
    category: "Combos",
    desc:
      "Hamburguesa 4x4 con 4 carnes. Cocinadas con mostaza a la plancha, lechuga, cebolla, tomate, queso cheddar americano y pan brioche. (Combo Papas y Coca Cola 250ml)",
    price: 65000,
    img: "4x4 Animal Style.png"
  },
  {
    id: "esp-02",
    name: "Texas",
    category: "Combos",
    desc:
      "Doble carne, cheddar, aros de cebolla, bacon, huevo frito y mucha salsa barbacoa. (Combo Papas y Coca Cola 250ml)",
    price: 55000,
    img: "texas.jpg",
    tag: "Más vendido"
  },
  {
    id: "esp-03",
    name: "Cheese Bacon",
    category: "Especiales",
    desc:
      "Doble carne smash, doble queso cheddar, queso crema, ketchup, mostaza y mucha panceta. (Combo Papas y Coca Cola 250ml)",
    price: 50000,
    img: "cheese.jpg"
  },

  // =======================
  // CLÁSICAS
  // =======================
  
  {
    id: "cla-01",
    name: "Cheese Regular",
    category: "Clásicas",
    desc: "90 gr carne, doble queso cheddar, salsa mil islas. No incluye papas y bebidas.",
    price: 39000,
    img: "Varios.jpg"
  },


  // =======================
  // ACOMPAÑAMIENTOS (genérico)
  // =======================
  {
    id: "aco-01",
    name: "Papas Fritas (Clásicas)",
    category: "Acompañamientos",
    desc: "Porción de papas fritas crocantes.",
    price: 15000,
    img: "papas.jpg"
  },

  // =======================
  // BEBIDAS (genérico)
  // =======================
  {
    id: "beb-01",
    name: "Gaseosa 250 ml",
    category: "Bebidas",
    desc: "Coca / Sprite / Fanta (según disponibilidad).",
    price: 8000,
    img: "cocac.jpg"
  },
];

// ========= Render Menú =========
const grid = $('#menuGrid');

function createCard(item){
  const el = document.createElement('article');
  el.className = 'card';

  el.innerHTML = `
    <div class="card__media">
      ${item.tag ? `<div class="card__tag">${item.tag}</div>` : ''}
      ${item.img ? `<img src="${item.img}" alt="${item.name}" loading="lazy">` : ''}
    </div>
    <div class="card__body">
      <h3 class="card__title">${item.name}</h3>
      <p class="card__desc">${item.desc || ''}</p>

      <div class="card__row">
        <div class="price">${formatPYG(item.price || 0)}</div>
        <a class="card__btn card__btn--primary" target="_blank" rel="noopener" href="${DELIVERY_URL}">
          <i class="bi bi-bag-fill"></i> Pedir
        </a>
      </div>

      <div class="card__row" style="margin-top:10px;">
        <a class="card__btn" target="_blank" rel="noopener" href="${INSTAGRAM_URL}">
          <i class="bi bi-instagram"></i> Instagram
        </a>
      </div>
    </div>
  `;
  return el;
}

function renderMenu(filter='all', q=''){
  grid.innerHTML = '';

  const normalized = q.trim().toLowerCase();
  const items = MENU_ITEMS.filter(it => {
    const byCategory = (filter === 'all') || (it.category === filter);
    const byQuery = !normalized || [it.name, it.desc, it.category].join(' ').toLowerCase().includes(normalized);
    return byCategory && byQuery;
  });

  if(items.length === 0){
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No hay productos para mostrar.';
    grid.appendChild(empty);
    return;
  }

  items.forEach(item => grid.appendChild(createCard(item)));
}

// Chips
const chips = $$('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');

    const filter = chip.getAttribute('data-filter');
    const q = $('#searchInput')?.value || '';
    renderMenu(filter, q);
  });
});

// Search
const searchInput = $('#searchInput');
if(searchInput){
  searchInput.addEventListener('input', (e) => {
    const active = $('.chip--active');
    const filter = active ? active.getAttribute('data-filter') : 'all';
    renderMenu(filter, e.target.value);
  });
}

// ========= Drawer Mobile =========
const navToggle = $('.nav__toggle');
const drawer = $('#navDrawer');
const backdrop = $('#drawerBackdrop');
const drawerClose = $('.drawer__close');

function openDrawer(){
  drawer.classList.add('is-open');
  backdrop.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.setAttribute('aria-hidden', 'false');
  navToggle.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-lock');
}
function closeDrawer(){
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-lock');
}

navToggle?.addEventListener('click', () => {
  drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
});
drawerClose?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if(!a) return;
  closeDrawer();
});

// ========= Varios =========
$('#year').textContent = new Date().getFullYear();

// Render inicial
renderMenu('all', '');