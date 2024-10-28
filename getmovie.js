const APIKEY = "04c35731a5ee918f014970082a0088b1";
let currentPage = 1;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?&api_key=${APIKEY}&include_adult=false&query=`;

const main = document.createElement("div");
main.id = "main-page";
document.body.appendChild(main);

const notification = document.createElement("div");
notification.id = "notification";
notification.className = "notification";
document.body.appendChild(notification);

const pagination = document.createElement("div");
pagination.className = "pagination";
document.body.appendChild(pagination);

const prevButton = document.createElement("button");
prevButton.id = "prev";
prevButton.textContent = "Previous";
pagination.appendChild(prevButton);

const nextButton = document.createElement("button");
nextButton.id = "next";
nextButton.textContent = "Next";
pagination.appendChild(nextButton);

// Placeholder for movies
function displayPlaceholders() {
  main.innerHTML = ""; // Clear previous content
  for (let i = 0; i < 20; i++) { // Show 20 placeholders
    const moviePlaceholder = document.createElement("div");
    moviePlaceholder.classList.add("movie", "placeholder");
    moviePlaceholder.innerHTML = `
       <div class="thumbnail-placeholder"></div>
       <div class="movie-info">
         <div class="title-placeholder"></div>
         <div class="rating-placeholder"></div>
       </div>
       <div class="overview">
         <div class="overview-placeholder"></div>
       </div>
     `;
    main.appendChild(moviePlaceholder);
  }
}

async function getMovies(url) {
  displayPlaceholders(); // Show placeholders immediately
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Network response was not ok");
    const respData = await resp.json();
    showMovies(respData.results);
  } catch (error) {
    console.error("Fetch error:", error);
    showNotification("No network connection. Please try again later.");
  }
}

function showMovies(movies) {
  main.innerHTML = ""; // Clear placeholders
  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
       <img src="${IMGPATH + poster_path}" alt="${title}" />
       <div class="movie-info">
         <h3>${title}</h3>
         <span class="${getClassByRate(vote_average)}">${vote_average}</span>
       </div>
       <div class="overview">
         <h4>Overview:</h4>
         ${overview}
         <a href="#" class="watch-now">Watch Now</a>
       </div>
     `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Pagination functionality
function loadPage(page) {
  const APIURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&include_adult=false&page=${page}`;
  getMovies(APIURL);
}

nextButton.addEventListener("click", () => {
  currentPage++;
  loadPage(currentPage);
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
});

// Using the existing search input and form
const form = document.getElementById("form");
const search = document.getElementById("search");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    currentPage = 1; // Reset to page 1 for new searches
    getMovies(SEARCHAPI + searchTerm);
    search.value = ""; // Clear the input field after search
  }
});

// Notification display
function showNotification(message) {
  notification.innerText = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Initial load
loadPage(currentPage); // Load the first page of movies
