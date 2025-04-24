const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

function updateCartPreview() {
    if (!cartList || !cartTotal) return; // 防止在沒有購物車元件的頁面出錯

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
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
                <button class="remove-btn" data-index="${index}">❌</button>
            </div>
        `;
        cartList.appendChild(row);
        total += item.total;
    });
    cartTotal.textContent = `總金額：NT$${total}`;

    cartList.querySelectorAll(".remove-btn").forEach(btn => { btn.onclick = (e) => {
        const index = parseInt(e.target.dataset.index);
        removeCartItem(index); 
        }; 
    });
    const goToOrderBtn = document.getElementById("go-to-order-btn");
    if (goToOrderBtn && location.pathname.includes("drinks.html")) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        goToOrderBtn.style.display = cart.length > 0 ? "block" : "none"; 
    }
}

function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartPreview();
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartPreview();
}

// 初始化購物車（當頁面載入時）
document.addEventListener("DOMContentLoaded", () => {
    updateCartPreview();
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        updateCartPreview(); // 每次回到頁面自動更新購物車 
    } 
});