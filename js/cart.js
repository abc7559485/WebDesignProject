const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

function updateCartPreview() {
  if (!cartList || !cartTotal) return;

  fetch("api/cart.php")
    .then(res => {
      if (!res.ok) throw new Error("未登入");
      return res.json();
    })
    .then(cart => {
      cartList.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        const row = document.createElement("li");
        row.innerHTML = `
          <div style="margin-bottom: 6px;">
            <strong>${item.name}</strong> × ${item.quantity}<br>
            <small>甜度：${item.sweetness}｜冰塊：${item.ice}</small><br>
            <small>加料：${item.toppings.join(", ") || "無"}</small><br>
            <small>小計：NT$${item.total}</small>
            <button class="remove-btn" onclick="removeCartItem(${index})">❌</button>
          </div>
        `;
        cartList.appendChild(row);
        total += item.total;
      });

      cartTotal.textContent = `總金額：NT$${total}`;

      const goToOrderBtn = document.getElementById("go-to-order-btn");
      if (goToOrderBtn && location.pathname.includes("drinks.html")) {
        goToOrderBtn.style.display = cart.length > 0 ? "block" : "none";
      }
    })
    .catch(() => {
      cartList.innerHTML = "<li>尚未登入</li>";
      cartTotal.textContent = "總金額：NT$0";
    });
}

function removeCartItem(index) {
  fetch("api/cart.php?index=" + index, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      updateCartPreview();
    });
}

function clearCart() {
  fetch("api/cart.php", {
    method: "DELETE"
  })
    .then(() => updateCartPreview());
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartPreview();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    updateCartPreview();
  }
});
