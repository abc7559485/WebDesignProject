const drinkList = document.getElementById("drink-list");
const modal = document.getElementById("modal");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const finalInfo = document.getElementById("final-info");
const addToCartBtn = document.getElementById("add-to-cart");

let currentDrink = null;
let drinksData = [];

let currentSelection = {
  sweetness: "正常糖",
  ice: "正常冰",
  toppings: [],
  quantity: 1,
  totalPrice: 0
};

// 載入飲料資料
fetch("api/drinks.php")
  .then((res) => res.json())
  .then((data) => {
    drinksData = data;
    renderDrinks();
    autoOpenDrinkById();
  });

function renderDrinks() {
  drinksData.forEach((drink) => {
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
}

function autoOpenDrinkById() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  if (id) {
    const targetDrink = drinksData.find((d) => d.id === id);
    if (targetDrink) openModal(targetDrink);
  }
}

function openModal(drink) {
  currentDrink = drink;
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
  const payload = {
    name: currentDrink.name,
    sweetness: currentSelection.sweetness,
    ice: currentSelection.ice,
    toppings: currentSelection.toppings,
    quantity: currentSelection.quantity,
    totalPrice: currentSelection.totalPrice
  };

  fetch("api/cart.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      updateCartPreview();
      closeModal();
    })
    .catch(err => {
      console.error("加入失敗", err);
      alert("❌ 加入購物車失敗");
    });
};

function openOrderModal() {
  const orderModal = document.getElementById("order-modal");
  const orderDetailList = document.getElementById("order-detail-list");
  const orderTotal = document.getElementById("order-total");

  fetch("api/cart.php")
    .then(res => res.json())
    .then(cart => {
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
        orderDetailList.appendChild(row);
        total += item.total;
      });

      orderTotal.textContent = `總金額：NT$${total}`;
      orderModal.style.display = "flex";
    });
}

function closeOrderModal() {
  document.getElementById("order-modal").style.display = "none";
}

function payOrder() {
  fetch("api/check_login.php")
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        alert("⚠ 請先登入才能結帳！");
        window.location.href = "login.html";
        return;
      }

      return fetch("api/order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: [] }) // 後端從 session 拿
      });
    })
    .then(res => res ? res.json() : null)
    .then(data => {
      if (!data) return;
      if (data.message.includes("成功")) {
        alert("✅ " + data.message);
        updateCartPreview();
        closeOrderModal();
      } else {
        alert("❌ " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("❌ 發生錯誤，訂單未完成");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartPreview();
});
