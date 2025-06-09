// 從後端取得飲料資料
fetch("api/drinks.php")
  .then(res => res.json())
  .then(drinksData => {
    const randomDrinks = getRandomDrink(drinksData, 3); // 隨機挑 3 個推薦
    renderRecommendations(randomDrinks);
  })
  .catch(error => {
    console.error("載入推薦飲品失敗：", error);
  });

// 隨機挑選 N 筆飲料
function getRandomDrink(drinks, count = 1) {
  const shuffled = drinks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 渲染推薦飲品卡片
function renderRecommendations(drinks) {
  const recommendationList = document.getElementById("recommendation-list");

  drinks.forEach(drink => {
    const card = document.createElement("div");
    card.className = "drink-card";
    card.innerHTML = `
      <img src="${drink.image}" alt="${drink.name}" />
      <h3>${drink.name}</h3>
      <p>${drink.description}</p>
      <p class="price">NT$${drink.price}</p>
    `;
    card.onclick = () => {
      window.location.href = `drinks.html?id=${drink.id}`;
    };
    recommendationList.appendChild(card);
  });
}
