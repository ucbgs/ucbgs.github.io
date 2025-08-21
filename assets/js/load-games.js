function revealInitialCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("visible");
    }, index * 3);
  });
}

// Sayfa yüklendiğinde sadece 1 kez çalıştır
document.addEventListener("DOMContentLoaded", revealInitialCards);

document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.querySelector(".index-page-games-list");
  if (!cardContainer) return;

  try {
    // REMOVED ALL AUTHENTICATION LOGIC - Direct game loading
    const response = await fetch("/data-json/games.json?v=2.0.0");
    const games = await response.json();
    let loadedIndex = 0;
    const batchSize = 40;

    // Aşağı ok simgesini ekleyelim
    const scrollArrow = document.createElement("div");
    scrollArrow.innerHTML = "&#x2193;";
    scrollArrow.classList.add("scroll-arrow");

    document.body.appendChild(scrollArrow);

    function loadMoreCards() {
      for (let i = 0; i < batchSize && loadedIndex < games.length; i++, loadedIndex++) {
        const game = games[loadedIndex];

        const isLarge = loadedIndex % 12 === 0 || Math.random() < 0.3;
        cardContainer.insertAdjacentHTML(
          "beforeend",
          `<a href="${game.url}" class="card${isLarge ? " large" : ""}">
            <picture>
              <source data-srcset="${game.image}" type="image/png" class="img-fluid" />
              <img data-src="${game.image}" alt="${game.title}" class="lazyload img-fluid" width="500" height="500" />
            </picture>
            <div class="card-body"><h3>${game.title}</h3></div>
          </a>`
        );
      }
      if (window.LazyLoad) new LazyLoad({ elements_selector: ".lazyload" });
      revealCards();

      if (loadedIndex >= games.length) {
        scrollArrow.remove();
      }
    }

    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) {
        loadMoreCards();
      }
      revealCards();
    }

    function revealCards() {
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        if (card.getBoundingClientRect().top < window.innerHeight - 50) {
          card.classList.add("visible");
        }
      });
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", revealCards);
    loadMoreCards();

    scrollArrow.addEventListener("click", () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  } catch (error) {
    console.error("Games yüklenirken hata oluştu:", error);
  }
});

// sag menu
document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.querySelector(".w-lg-300.right-side-games");
  if (!cardContainer) return;

  try {
    const response = await fetch("/data-json/games.json?v=2.0.0");
    const games = await response.json();

    function getRandomGames(games, count) {
      let shuffled = games.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }

    const selectedGames = getRandomGames(games, 20);

    // Reklam kartı ekle
    const adElement = document.createElement("a");
    adElement.classList.add("card", "large");
    adElement.innerHTML = `<ins class="adsbygoogle" style="display:inline-block; width:260px; height:260px" data-ad-client="ca-pub-7321073664976914" data-ad-slot="1811365994"></ins>`;
    cardContainer.appendChild(adElement);
    (window.adsbygoogle = window.adsbygoogle || []).push({});

    selectedGames.forEach((game) => {
      const card = document.createElement("a");
      card.href = game.url;
      card.classList.add("card");
      card.innerHTML = `
        <picture>
          <source data-srcset="${game.image}" type="image/png" class="img-fluid" />
          <img data-src="${game.image}" alt="${game.title}" class="lazyload img-fluid" width="500" height="500" />
        </picture>
        <div class="card-body"><h3>${game.title}</h3></div>
      `;
      cardContainer.appendChild(card);
    });

    if (window.LazyLoad) new LazyLoad({ elements_selector: ".lazyload" });

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.add("visible");
    });
  } catch (error) {
    console.error("Games yüklenirken hata oluştu:", error);
  }
});

// sol menu
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".w-lg-300.lef-side-games.card-masonry");

  if (container) {
    let items = Array.from(container.querySelectorAll("a.card-collection"));

    items.sort(() => Math.random() - 0.5);

    items.forEach((item) => container.appendChild(item));

    items.forEach((item, index) => {
      if (index < 12) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
});
