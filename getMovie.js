function loadPage(page) {
  const APIURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&

include_adult=false&with_genres=28,35,10751&certification_country=US&certification.lte=PG&page=${page}`;


  getMovies(APIURL);
}

function showMovies(movies) {
  main.innerHTML = ""; // Clear placeholders
  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;

    // Filter out movies with certain keywords
    const keywordsToAvoid = ["sex", "nude", "adult", "explicit"];
    const containsKeyword = keywordsToAvoid.some(keyword => title.toLowerCase().includes(keyword) || overview.toLowerCase().includes(keyword));

    if (!containsKeyword) {
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
    }
  });
}
