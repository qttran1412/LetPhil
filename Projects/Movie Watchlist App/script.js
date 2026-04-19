
const API_KEY = "fa77d3265bedae562eb3643858bb544d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w200";


const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("nav a");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const searchMessage = document.getElementById("searchMessage");

const watchlistContainer = document.getElementById("watchlistContainer");
const watchlistMessage = document.getElementById("watchlistMessage");

const detailsContainer = document.getElementById("detailsContainer");

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");


let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function saveWatchlist() {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}


function showPage(pageId) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

window.addEventListener("hashchange", () => {
  const page = location.hash.replace("#", "") || "home";
  showPage(page);
});


async function searchMovies() {
  const query = searchInput.value;

  if (!query) {
    searchMessage.textContent = "Enter a movie name";
    return;
  }

  searchMessage.textContent = "Loading...";

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  const data = await res.json();

  console.log(data);

  searchResults.innerHTML = "";

  if (!data.results) {
    searchMessage.textContent = "No results";
    return;
  }

  data.results.forEach(movie => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/180x270?text=No+Image'}" alt="${movie.title}">
      <br>
      <button onclick="showDetails(${movie.id})">Details</button>
      <button onclick="addToWatchlist(${movie.id})">Save</button>
    `;

    searchResults.appendChild(div);
  });
}

// Movie Details
async function showDetails(id) {
  location.hash = "details";

  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  const movie = await res.json();

  detailsContainer.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/180x270?text=No+Image'}" alt="${movie.title}">
    <p>${movie.overview}</p>
    <button onclick="addToWatchlist(${movie.id})">Save</button>
  `;
}

// Watchlist
function addToWatchlist(id) {
  if (watchlist.includes(id)) {
    alert("Already saved");
    return;
  }

  watchlist.push(id);
  saveWatchlist();
  renderWatchlist();
}

function removeFromWatchlist(id) {
  watchlist = watchlist.filter(m => m !== id);
  saveWatchlist();
  renderWatchlist();
}

async function renderWatchlist() {
  watchlistContainer.innerHTML = "";

  if (watchlist.length === 0) {
    watchlistMessage.textContent = "Empty";
    return;
  }

  watchlistMessage.textContent = "";

  for (let id of watchlist) {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    const movie = await res.json();

    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${IMAGE_URL + movie.poster_path}">
      <br>
      <button onclick="showDetails(${movie.id})">Details</button>
      <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
    `;

    watchlistContainer.appendChild(div);
  }
}

// Contact Form
contactForm.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: name.value,
    email: email.value,
    suggestion: suggestion.value
  };

  localStorage.setItem("contact", JSON.stringify(data));

  contactMessage.textContent = "Saved!";
  contactForm.reset();
});

// Events
searchBtn.addEventListener("click", searchMovies);

// Init
renderWatchlist();