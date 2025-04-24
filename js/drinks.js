const drinkList = document.getElementById("drink-list");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const finalInfo = document.getElementById("final-info");
const addToCartBtn = document.getElementById("add-to-cart");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

let currentDrink = null;
let currentSelection = {
  sweetness: "正常糖",
  ice: "正常冰",
  toppings: [],
  quantity: 1,
  totalPrice: 0
};

const drinksData = [
  {
    id: 1,
    name: "茉香綠茶",
    description: "清新淡雅的綠茶香氣。",
    price: 35,
    image: "img/drinks/jasmine-green-tea.jpg"
  },
  {
    id: 2,
    name: "珍珠奶茶",
    description: "香濃奶茶搭配Q彈珍珠。",
    price: 50,
    image: "img/drinks/bubble-milk-tea.jpg"
  },
  {
    id: 3,
    name: "四季春茶",
    description: "介於綠與烏龍之間的爽口滋味。",
    price: 35,
    image: "img/drinks/4season.jpg"
  },
  {
    id: 4,
    name: "芒果綠茶",
    description: "果香與茶香的完美融合。",
    price: 55,
    image: "img/drinks/mango-green.jpg"
  },
  {
    id: 5,
    name: "冬瓜檸檬",
    description: "冬瓜的甘甜與檸檬的清爽。",
    price: 45,
    image: "img/drinks/wintermelon-lemon.jpg"
  },
  {
    id: 6,
    name: "紅茶拿鐵",
    description: "濃厚紅茶搭配香醇鮮奶。",
    price: 55,
    image: "img/drinks/blacktea-latte.jpg"
  },
  {
    id: 7,
    name: "奶蓋烏龍",
    description: "茶香濃郁搭配綿密奶蓋。",
    price: 60,
    image: "img/drinks/oolong-cream.jpg"
  },
  {
    id: 8,
    name: "百香雙響炮",
    description: "百香果加珍珠與椰果的熱鬧口感。",
    price: 55,
    image: "img/drinks/passionfruit-mix.jpg"
  },
  {
    id: 9,
    name: "黑糖鮮奶",
    description: "濃郁黑糖與鮮奶的完美搭配。",
    price: 60,
    image: "img/drinks/brownsugar-milk.jpg"
  },
];


// 顯示飲品卡片
drinksData.forEach(drink => {
  const card = document.createElement("div");
  card.className = "drink-card";
  card.innerHTML = `
    <img src="${drink.image}" />
    <h3>${drink.name}</h3>
    <p>${drink.description}</p>
    <div class="price">NT$${drink.price}</div>
  `;
  card.onclick = () => openModal(drink);
  drinkList.appendChild(card);
});

function openModal(drink) {
  currentDrink = drink;
  // modalImage.src = drink.image;
  modalName.textContent = drink.name;
  modalDesc.textContent = drink.description;
  finalInfo.innerHTML = '';
  modal.classList.remove("hidden");

  const form = document.forms["custom-form"];
  form.reset();
  updatePrice();

  form.sweetness.onchange = updatePrice;
  form.ice.onchange = updatePrice;
  form.quantity.oninput = updatePrice;
  form.querySelectorAll("input[name='toppings']").forEach(input => {
    input.onchange = updatePrice;
  });
}

function closeModal() {
  modal.classList.add("hidden");
}

function updatePrice() {
  const form = document.forms["custom-form"];
  const sweetness = form.sweetness.value;
  const ice = form.ice.value;
  const quantity = parseInt(form.quantity.value) || 1;
  const toppings = Array.from(form.querySelectorAll("input[name='toppings']:checked")).map(t => t.value);
  const toppingCost = toppings.length * 10;
  const unitTotal = currentDrink.price + toppingCost;
  const total = unitTotal * quantity;

  currentSelection = {
    sweetness,
    ice,
    toppings,
    quantity,
    totalPrice: total
  };

  finalInfo.innerHTML = `
    <hr>
    <p><strong>訂單資訊：</strong></p>
    <p>${currentDrink.name} × ${quantity}（${sweetness}, ${ice}）</p>
    <p>加料：${toppings.join(", ") || "無"}</p>
    <p><strong>總金額：NT$${total}</strong></p>
  `;
}

addToCartBtn.onclick = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item =>
    item.name === currentDrink.name &&
    item.sweetness === currentSelection.sweetness &&
    item.ice === currentSelection.ice &&
    JSON.stringify(item.toppings) === JSON.stringify(currentSelection.toppings)
  );

  if (existing) {
    existing.quantity += currentSelection.quantity;
    existing.total += currentSelection.totalPrice;
  } else {
    cart.push({
      name: currentDrink.name,
      sweetness: currentSelection.sweetness,
      ice: currentSelection.ice,
      toppings: currentSelection.toppings,
      quantity: currentSelection.quantity,
      total: currentSelection.totalPrice
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartPreview();  // 確保加入購物車後立即更新總金額
  alert("✔ 已加入購物車！");
  closeModal();
  updateGoToOrderButton();
};

function updateCartPreview() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("li");
    row.innerHTML = `
        <div style="margin-bottom: 6px;">
        <strong>${item.name}</strong> × ${item.quantity}<br> <small>甜度：${item.sweetness}｜冰塊：${item.ice}</small><br> <small>加料：${item.toppings.join(", ") || "無"}</small><br> <small>小計：NT$${item.total}</small>
        <button class="remove-btn" data-index="${index}">❌</button>
    `;
    cartList.appendChild(row);
    total += item.total;
  });
  

  cartTotal.textContent = `總金額：NT$${total}`;
  console.log('更新總金額成功', total); // debug 用

  cartList.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = (e) => {
      const index = parseInt(e.target.dataset.index);
      removeCartItem(index);
    };
  });
  const goToOrderBtn = document.getElementById("go-to-order-btn");
  if (goToOrderBtn) {
     goToOrderBtn.style.display = cart.length > 0 ? "block" : "none"; 
  }
}

function removeCartItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartPreview();
}

// 打開訂單明細彈窗
function openOrderModal() {
  const orderModal = document.getElementById("order-modal");
  const orderDetailList = document.getElementById("order-detail-list");
  const orderTotal = document.getElementById("order-total");
  
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  orderDetailList.innerHTML = "";
  let total = 0;
  
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "order-item";
    row.innerHTML = `
      <strong>${item.name}</strong> × ${item.quantity}<br>
      <small>甜度：${item.sweetness}｜冰塊：${item.ice}</small><br>
      <small>加料：${item.toppings.join(", ") || "無"}</small><br>
      <small>小計：NT$${item.total}</small>
    `;
    total += item.total;
    orderDetailList.appendChild(row);
  });
  
  orderTotal.textContent = `總金額：NT$${total}`;
  orderModal.style.display = "flex";
  }
  
  // 關閉訂單明細
  function closeOrderModal() {
  const orderModal = document.getElementById("order-modal");
  orderModal.style.display = "none";
  }
  
  // 綁定「前往付款」按鈕事件（可根據需求改為跳轉頁面）
  document.querySelector(".pay-button").onclick = () => {
  alert("💸 模擬付款成功！感謝您的訂購！");
  // 可加清空購物車、跳轉付款頁等功
  }

updateCartPreview();
