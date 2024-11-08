const APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIURL = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&with_genres=28&certification_country=US&certification.gte=PG&include_adult=false`;
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
let currentSearchTerm = '';
let currentIndustry = '';

// Industry dropdown for selecting movies by industry
const industrySelect = document.createElement("select");
industrySelect.innerHTML = `
  <option value="">Select Industry</option>
  <option value="hollywood">Hollywood</option>
  <option value="bollywood">Bollywood</option>
  <option value="nollywood">Nollywood</option>
  <option value="chinese">Chinese</option>
  <option value="south-korean">South Korean</option>
  <option value="japanese">Japanese</option>
  <option value="australian">Australian</option>
  <option value="canadian">Canadian</option>
  <option value="mexican">Mexican</option>
  <option value="argentine">Argentine</option>
`;
document.body.insertBefore(industrySelect, main);

// Function to fetch the correct URL based on industry
function getMovieUrlByIndustry(industry) {
  const baseUrl = "https://api.themoviedb.org/3/discover/movie";
  const apiKey = APIKEY;
  const genre = "28"; // Action genre ID
  const language = "en-US"; // Response language

  const industryMap = {
    hollywood: { region: "US", originalLanguage: "en" },
    bollywood: { region: "IN", originalLanguage: "hi" },
    nollywood: { region: "NG", originalLanguage: "en" },
    chinese: { region: "CN", originalLanguage: "zh" },
    south-korean: { region: "KR", originalLanguage: "ko" },
    japanese: { region: "JP", originalLanguage: "ja" },
    australian: { region: "AU", originalLanguage: "en" },
    canadian: { region: "CA", originalLanguage: "fr" },
    mexican: { region: "MX", originalLanguage: "es" },
    argentine: { region: "AR", originalLanguage: "es" }
  };

  const { region = "US", originalLanguage = "en" } = industryMap[industry] || {};
  return `${baseUrl}?api_key=${apiKey}&with_genres=${genre}&language=${language}&region=${region}&sort_by=popularity.desc&original_language=${originalLanguage}`;
}

// Function to fetch movies with a dynamic SEARCHTERM or INDUSTRY
function searchMovies(searchTerm = '', industry = '') {
  currentSearchTerm = searchTerm;
  currentIndustry = industry;
  currentPage = 1; // Reset to the first page

  const url = searchTerm
    ? `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${encodeURIComponent(searchTerm)}&include_adult=false`
    : industry
    ? getMovieUrlByIndustry(industry)
    : APIURL;
  
  getMovies(url, currentPage);
}

async function getMovies(url, page = 1) {
  main.innerHTML = "<p>Loading movies...</p>";
  try {
    const resp = await fetch(`${url}&page=${page}`);
    const respData = await resp.json();

    if (respData.results.length === 0) {
      main.innerHTML = "<p>No movies found. Try a different search.</p>";
      return;
    }

    showMovies(respData.results);
    
    // Enable/Disable buttons based on page number
    prevButton.disabled = page === 1;
    nextButton.disabled = page === respData.total_pages;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    main.innerHTML = "<p>Failed to load movies. Please try again later.</p>";
  }
}

function showMovies(movies) {
  main.innerHTML = "";
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
  return vote >= 8 ? 'green' : vote >= 5 ? 'orange' : 'red';
}

// Pagination buttons event listeners
nextButton.addEventListener("click", () => {
  currentPage++;
  const url = currentSearchTerm
    ? `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${encodeURIComponent(currentSearchTerm)}&include_adult=false`
    : currentIndustry
    ? getMovieUrlByIndustry(currentIndustry)
    : APIURL;
  getMovies(url, currentPage);
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    const url = currentSearchTerm
      ? `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${encodeURIComponent(currentSearchTerm)}&include_adult=false`
      : currentIndustry
      ? getMovieUrlByIndustry(currentIndustry)
      : APIURL;
    getMovies(url, currentPage);
  }
});

// Event listener for industry selection
industrySelect.addEventListener("change", (e) => {
  const selectedIndustry = e.target.value;
  searchMovies('', selectedIndustry);
});
