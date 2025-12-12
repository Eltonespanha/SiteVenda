// Produtos de exemplo
const products = [
  {
    id: 1,
    name: "Santo Antônio em Gesso 20cm",
    category: "santo",
    material: "gesso",
    price: 39.9,
    tag: "Santo Antônio, casamentos",
  },
  {
    id: 2,
    name: "Nossa Senhora Aparecida em Resina 25cm",
    category: "santo",
    material: "resina",
    price: 79.9,
    tag: "Aparecida, padroeira do Brasil",
  },
  {
    id: 3,
    name: "Sagrado Coração de Jesus em Gesso 30cm",
    category: "santo",
    material: "gesso",
    price: 89.9,
    tag: "Sagrado Coração",
  },
  {
    id: 4,
    name: "Kit 3 Velas Decorativas Brancas",
    category: "kit",
    material: "parafina",
    price: 29.9,
    tag: "velas, decoração",
  },
  {
    id: 5,
    name: "Vela Perfumada de Igreja (Baunilha)",
    category: "vela",
    material: "parafina",
    price: 19.9,
    tag: "perfumada",
  },
  {
    id: 6,
    name: "Nossa Senhora das Graças em Resina 18cm",
    category: "santo",
    material: "resina",
    price: 69.9,
    tag: "Nossa Senhora das Graças",
  },
  {
    id: 7,
    name: "Kit Santos Pequenos em Gesso (5 peças)",
    category: "kit",
    material: "gesso",
    price: 119.9,
    tag: "kit, mini santos",
  },
  {
    id: 8,
    name: "Vela 7 Dias - Branca",
    category: "vela",
    material: "parafina",
    price: 9.9,
    tag: "vela 7 dias",
  },
];

let filteredProducts = [...products];
let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const cartModal = document.getElementById("cartModal");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");
const startCheckout = document.getElementById("startCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const finishOrder = document.getElementById("finishOrder");

// MENU DE CATEGORIAS
const menuButtons = document.querySelectorAll(".menu-btn");

menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    if (filter === "all") {
      filteredProducts = [...products];
    } else if (filter === "santo-gesso") {
      filteredProducts = products.filter(
        (p) => p.category === "santo" && p.material === "gesso"
      );
    } else if (filter === "santo-resina") {
      filteredProducts = products.filter(
        (p) => p.category === "santo" && p.material === "resina"
      );
    } else if (filter === "vela") {
      filteredProducts = products.filter((p) => p.category === "vela");
    } else if (filter === "kit") {
      filteredProducts = products.filter((p) => p.category === "kit");
    }

    applySearchAndSort();
  });
});

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

function renderProducts() {
  productGrid.innerHTML = "";
  if (filteredProducts.length === 0) {
    productGrid.innerHTML =
      "<p class='empty-text'>Nenhum produto encontrado.</p>";
    return;
  }

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div>
        <div class="product-image">
          Imagem ilustrativa do produto<br>${product.name}
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-category">Categoria: ${labelCategory(
          product.category
        )}</div>
        <div class="product-material">Material: ${labelMaterial(
          product.material
        )}</div>
        <div class="product-price">R$ ${formatPrice(product.price)}</div>
      </div>
      <div class="product-actions">
        <span class="badge">${product.tag}</span>
        <button class="btn-add" data-id="${product.id}">Adicionar</button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      addToCart(id);
    });
  });
}

function labelCategory(cat) {
  if (cat === "santo") return "Santo";
  if (cat === "vela") return "Vela";
  if (cat === "kit") return "Kit";
  return cat;
}

function labelMaterial(mat) {
  if (mat === "gesso") return "Gesso";
  if (mat === "resina") return "Resina";
  if (mat === "parafina") return "Parafina";
  return mat;
}

function applySearchAndSort() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  let temp = [...filteredProducts];

  if (searchTerm) {
    temp = temp.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.tag.toLowerCase().includes(searchTerm)
    );
  }

  const sort = sortSelect.value;
  if (sort === "price-asc") {
    temp.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    temp.sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    temp.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    temp.sort((a, b) => b.name.localeCompare(a.name));
  }

  filteredProducts = temp;
  renderProducts();
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML =
      "<p class='empty-text'>Seu carrinho está vazio.</p>";
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div>
          <span><strong>${item.name}</strong></span>
          <span>R$ ${formatPrice(item.price)} cada</span>
        </div>
        <div class="cart-qty">
          <button data-id="${item.id}" data-action="minus">-</button>
          <span>${item.qty}</span>
          <button data-id="${item.id}" data-action="plus">+</button>
        </div>
      `;

      cartItems.appendChild(row);
    });

    cartItems.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const action = btn.getAttribute("data-action");
        changeCartQty(id, action);
      });
    });
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  cartSubtotal.textContent = formatPrice(subtotal);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = `(${totalQty})`;
}

function changeCartQty(id, action) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (action === "plus") item.qty += 1;
  if (action === "minus") item.qty -= 1;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  updateCartUI();
}

// Eventos principais
searchInput.addEventListener("input", applySearchAndSort);
sortSelect.addEventListener("change", applySearchAndSort);

// Modal carrinho
openCart.addEventListener("click", () => {
  cartModal.style.display = "flex";
});
closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
  checkoutForm.style.display = "none";
});
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
    checkoutForm.style.display = "none";
  }
});

startCheckout.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }
  checkoutForm.style.display = "block";
});

// FINALIZAR PEDIDO VIA WHATSAPP
finishOrder.addEventListener("click", () => {
  const name = document.getElementById("nameInput").value;
  const whats = document.getElementById("whatsInput").value;
  const address = document.getElementById("addressInput").value;
  const note = document.getElementById("noteInput").value;

  if (!name || !whats || !address) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let message = `Olá, sou ${name}.\n\nQuero fazer um pedido na ZION Art Sacra:\n\n`;
  
  cart.forEach(item => {
    message += `• ${item.name} (Qtd: ${item.qty}) - R$ ${formatPrice(item.price * item.qty)}\n`;
  });

  message += `\nSubtotal: R$ ${formatPrice(subtotal)}\n`;
  message += `\nWhatsApp para contato: ${whats}\n`;
  message += `\nEndereço:\n${address}\n`;

  if (note) {
    message += `\nObservações:\n${note}\n`;
  }

  message += `\nPor favor, me envie as opções de pagamento (Pix / Cartão).`;

  // Coloque seu número aqui (DDI + DDD + número)
  const phone = "5518988079517"; // exemplo: 5518999999999

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;

  window.open(url, "_blank");

  cart = [];
  updateCartUI();
  checkoutForm.style.display = "none";
  cartModal.style.display = "none";
});

// Inicialização
renderProducts();
updateCartUI();