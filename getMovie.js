const APIKEY = '04c35731a5ee918f014970082a0088b1';

const IMGPATH = 'https://image.tmdb.org/t/p/w1280';

const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=${APIKEY}&query=';

const main = document.getElementById("main");

const form = document.getElementById("form");

const search = document.getElementById("search");

const pagination = document.createElement("div");
pagination.className = "pagination";

const prevButton = document.createElement("button");
prevButton.id = "prev";
prevButton.textContent = "Previous";

const nextButton = document.createElement("button");
nextButton.id = "next";
nextButton.textContent = "Next";

// Placeholder for movies
function displayPlaceholders() {
  main.innerHTML = ""; 

  for (let i = 0; i < 20; i++) { // Show 20 placeholders
    const moviePlaceholder = document.createElement("div");
    moviePlaceholder.classList.add("movie", "placeholder");
    moviePlaceholder.innerHTML = `
       <div class="thumbnail-placeholder"></div>
       <div class="movie-info">
         <h3 class="title-placeholder"></h3>
         <span class="rating-placeholder"></span>
       </div>
       <div class="overview">
          <h2 class="overview-placeholder"></h2>
          <p></p>
       </div>
     `;
    main.appendChild(moviePlaceholder);
  }
}

async function getMovies(url) {
displayPlaceholders(); 
  const resp = await fetch(url);
  const respData = await resp.json();
  console.log(respData);
  showMovies(respData.results);
}

function showMovies(movies) {
  //clear main
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;
    // raja
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
       <img src="${IMGPATH + poster_path}" alt="${title}"/>
     <div class="movie-info">
         <h3>${title}</h3>
         <span class="${getClassByRate(vote_average)}">${vote_average}</span>
     </div> 
     <div class="overview">
     <h2>Overview:</h2>
     ${overview}
     </div>
     `;
    main.appendChild(movieEl)
  });
document.body.appendChild(pagination);
pagination.appendChild(prevButton);
pagination.appendChild(nextButton);
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange'
  } else {
    return 'red';
  }
}

// Pagination functionality
function loadPage(page) {
const APIURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&page=${page}`;
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
currentPage = 1; // Reset to page 1 for new searches
    getMovies(SEARCHAPI + searchTerm);
    search.value = "";
  }
});

// Initial load
loadPage(currentPage); // Load the first page of movies
