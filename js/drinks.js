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

<<<<<<< HEAD
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
=======
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
  {
    id: 10,
    name: "奶蓋黑糖烏龍",
    description: "黑糖與鹹香奶蓋碰撞出的絕妙風味。",
    price: 65,
    image: "img/drinks/BlackSugarMilkTea.png"
  },
  {
    id: 11,
    name: "芋泥珠珠",
    description: "濃郁大甲芋泥與小農鮮奶Q彈珍珠的完美結合。",
    price: 70,
    image: "img/drinks/idontknowthisname.png"
>>>>>>> b81d3947160469f726764656f92a69060722ad63
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
<<<<<<< HEAD
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
=======
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const order = {
      items: cart,
      total: cart.reduce((sum, item) => sum + item.total, 0),
      time: new Date().toLocaleString()
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    alert("💸 模擬付款成功！感謝您的訂購！");
    localStorage.removeItem("cart");  
    updateCartPreview(); 
    closeOrderModal();
  }
>>>>>>> b81d3947160469f726764656f92a69060722ad63

document.addEventListener("DOMContentLoaded", () => {
  updateCartPreview();
});
