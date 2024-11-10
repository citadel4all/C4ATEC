const APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIURL = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&with_genres=28&certification_country=US&certification.lte=PG&include_adult=false`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const DEFAULT_IMG = "https://via.placeholder.com/500x750?text=No+Image+Available";

const main = document.getElementById("main-display");
const pagination = document.createElement("div");
pagination.classList.add("pagination");
document.body.appendChild(pagination);

// Create Previous and Next buttons
const prevButton = document.createElement("button");
prevButton.textContent = "Previous";
prevButton.disabled = true;
pagination.appendChild(prevButton);

const nextButton = document.createElement("button");
nextButton.textContent = "Next";
pagination.appendChild(nextButton);

let currentPage = 1;
let currentLink = APIURL;

// Function to fetch movies with a dynamic SEARCHTERM
function searchMovies(platformTitle='', searchTerm='') {
  let url;
  
  if (platformTitle) {
    url = urlByPlatform(platformTitle.toLowerCase());
  } else {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${encodeURIComponent(searchTerm)}&include_adult=false`;
  }

  currentLink = url;
  currentPage = 1;
  getMovies(currentLink, currentPage);
}

function urlByPlatform(platform) {
  const baseUrl = "https://api.themoviedb.org/3/discover/movie";
  const apiKey = APIKEY;
  const adult = "false";
  const genre = "28";
  const language = "en-US";
  
  let platformID;
  switch (platform) {
    case "netflix":
      platformID = "8";
      break;
    case "disney-plus":
      platformID = "337";
      break;
    case "apple-tv-plus":
      platformID = "350";
      break;
    case "paramount-plus":
      platformID = "531";
      break;
    case "hulu":
      platformID = "15";
      break;
    case "starz":
      platformID = "43";
      break;
    default:
      platformID = "8"; // Default to Netflix if no match
  }

  // Construct the TMDb URL
  const url = `${baseUrl}?api_key=${apiKey}&language=${language}&sort_by=popularity.desc&include_adult=${adult}&with_genres=${genre}&with_watch_providers=${platformID}&watch_region=US`;
  
  return url;
}

async function getMovies(url, page = 1) {
  main.innerHTML = "<p>Loading movies...</p>"; // Show loading indicator
  try {
    const resp = await fetch(`${url}&page=${page}`);
    const respData = await resp.json();
    
    main.innerHTML = ""; // Clear previous content

    if (respData.results.length === 0) {
      main.innerHTML = "<p>No movies found. Try a different search.</p>";
      return;
    }
    
    showMovies(respData.results);
    
    prevButton.disabled = page === 1;
    nextButton.disabled = page >= respData.total_pages;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    main.innerHTML = "<p>Failed to load movies. Please try again later.</p>";
  }
}

function showMovies(movies) {
  main.innerHTML = ""; // Clear previous content

  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    const img = document.createElement("img");
    img.src = poster_path ? `${IMGPATH + poster_path}` : DEFAULT_IMG;
    img.alt = title;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");
    movieInfo.innerHTML = `
      <h3>${title}</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    `;

    const movieOverview = document.createElement("div");
    movieOverview.classList.add("overview");
    movieOverview.innerHTML = `<h2>Overview:</h2>${overview}`;

    movieEl.appendChild(img);
    movieEl.appendChild(movieInfo);
    movieEl.appendChild(movieOverview);
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) return 'green';
  else if (vote >= 5) return 'orange';
  else return 'red';
}

nextButton.addEventListener("click", () => {
  currentPage++;
  getMovies(currentLink, currentPage);
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(currentLink, currentPage);
  }
});
