const APIKEY = '04c35731a5ee918f014970082a0088b1';

const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&include_adult=false&with_genres=28,35,10751&certification_country=US&certification.lte=PG&page=1";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&include_adult=false&with_genres=28,35,10751&certification_country=US&certification.lte=PG&query=";

const main = document.getElementById("main-display");
const form = document.getElementById("form");
const search = document.getElementById("search");

getMovies(APIURL);

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
  console.log(respData);
  showMovies(respData.results);
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
if (vote >= 8) {
return 'green';
} else if (vote >= 5) {
return 'orange'
} else {
return 'red';
}}

form.addEventListener("submit", (e) => {
e.preventDefault();
const searchTerm = search.value; if (searchTerm) { getMovies(SEARCHAPI + searchTerm); search.value = "";
}
});
