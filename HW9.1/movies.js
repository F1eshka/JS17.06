const API_KEY = "a8b59dff";
const form = document.getElementById("searchForm");
const resultsDiv = document.getElementById("results");
const paginationDiv = document.getElementById("pagination");
const detailsDiv = document.getElementById("details");

let currentQuery = "";
let currentType = "";
let currentPage = 1;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  currentQuery = document.getElementById("title").value.trim();
  currentType = document.getElementById("type").value;
  currentPage = 1;
  fetchMovies();
});

function fetchMovies() {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(currentQuery)}&type=${currentType}&page=${currentPage}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      resultsDiv.innerHTML = "";
      detailsDiv.innerHTML = "";
      paginationDiv.innerHTML = "";

      if (data.Response === "False") {
        resultsDiv.textContent = "Movie not found!";
        return;
      }

      data.Search.forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/250x350?text=No+Image"}" alt="${movie.Title}">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
          <button data-id="${movie.imdbID}">Details</button>
        `;
        resultsDiv.appendChild(div);
      });

      const totalPages = Math.ceil(data.totalResults / 10);
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) {
          btn.disabled = true;
        }
        btn.addEventListener("click", () => {
          currentPage = i;
          fetchMovies();
        });
        paginationDiv.appendChild(btn);
      }

      document.querySelectorAll(".movie button").forEach(btn => {
        btn.addEventListener("click", () => {
          fetchDetails(btn.dataset.id);
        });
      });
    });
}

function fetchDetails(imdbID) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  fetch(url)
    .then(res => res.json())
    .then(movie => {
      detailsDiv.innerHTML = `
        <h3>${movie.Title} (${movie.Year})</h3>
        <p><strong>Жанр:</strong> ${movie.Genre}</p>
        <p><strong>Режисер:</strong> ${movie.Director}</p>
        <p><strong>Актори:</strong> ${movie.Actors}</p>
        <p><strong>Сюжет:</strong> ${movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
      `;
    });
}
