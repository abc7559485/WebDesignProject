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
  }
];
  
  function getRandomDrink(drinks, count = 1) {
    const shuffled = drinks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  const recommendationList = document.getElementById("recommendation-list");
  const randomDrinks = getRandomDrink(drinksData, 3);
  
  randomDrinks.forEach(drink => {
    const card = document.createElement("div");
    card.className = "drink-card";
    card.innerHTML = `
      <img src="${drink.image}" alt="${drink.name}" />
      <h3>${drink.name}</h3>
      <p>${drink.description}</p>
      <p class="price">NT$${drink.price}</p>
    `;
    recommendationList.appendChild(card);
    card.onclick = () => {
       window.location.href = `drinks.html?id=${drink.id}`; 
    };
  });

  function goToLogin() {
    window.location.href = "login.html"; // 登入頁
  }
  
  function updateUserDropdown() {
    const userInfo = document.getElementById("user-info");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user && user.name && user.email) {
      userInfo.innerHTML = `
        <p>👤 ${user.name}</p>
        <p>${user.email}</p>
        <p style="font-size: 13px; color: #1e88e5;">點擊前往詳細頁面</p>
      `;
    } else {
      userInfo.innerHTML = `<p>請登入帳號</p>`;
    }
  }
  
  function logout() {
    localStorage.removeItem("user");
    updateUserDropdown();
  }
  
  // 每次載入都更新使用者資訊
  document.addEventListener("DOMContentLoaded", () => {
    updateUserDropdown();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.getElementById("user-icon");
    if (userIcon) {
      userIcon.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name && user.email) {
          window.location.href = "user.html";  // 登入過，進入使用者頁面
        } else {
          window.location.href = "login.html"; // 未登入，導向登入頁
        }
      });
    }
  });