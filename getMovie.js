const APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIURL = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&query=family-friendly+anime&with_genres=16&certification_country=US&certification.lte=PG&include_adult=false
`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
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

// Fetch movies on initial load
getMovies(APIURL, currentPage);

async function getMovies(url, page = 1) {
  main.innerHTML = ""; // Clear previous content
  const resp = await fetch(`${url}&page=${page}`);
  const respData = await resp.json();
  showMovies(respData.results);
  
  // Enable/Disable buttons based on page number
  prevButton.disabled = page === 1;
  nextButton.disabled = page === respData.total_pages;
}

function showMovies(movies) {
  main.innerHTML = ""; // Clear previous content

  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;

    // Create movie element
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    // Placeholder image while loading
    const placeholder = document.createElement("div");
    placeholder.classList.add("thumbnail-placeholder");

    // Actual image element
    const img = document.createElement("img");
    img.src = `${IMGPATH + poster_path}`;
    img.alt = title;
    img.style.display = "none"; // Hide image initially

    // Display image only after it has fully loaded
    img.onload = () => {
      placeholder.style.display = "none"; // Hide placeholder
      img.style.display = "block"; // Show the loaded image
    };

    // Movie content
    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");
    movieInfo.innerHTML = `
      <h3>${title}</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    `;

    const movieOverview = document.createElement("div");
    movieOverview.classList.add("overview");
    movieOverview.innerHTML = `<h2>Overview:</h2>${overview}`;

    // Append elements to movie container
    movieEl.appendChild(placeholder);
    movieEl.appendChild(img);
    movieEl.appendChild(movieInfo);
    movieEl.appendChild(movieOverview);

    main.appendChild(movieEl); // Add movie to main container
  });
}

function getClassByRate(vote) {
  if (vote >= 8) return 'green';
  else if (vote >= 5) return 'orange';
  else return 'red';
}

// Pagination buttons event listeners
nextButton.addEventListener("click", () => {
  currentPage++;
  getMovies(APIURL, currentPage);
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(APIURL, currentPage);
  }
});
