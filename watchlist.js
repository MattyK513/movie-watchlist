const watchlistContainer = document.getElementById("watchlist-container");
let currentPage = 1;

document.addEventListener('click', e => {
    if (e.target.dataset.remove) {
        localStorage.removeItem(e.target.dataset.remove)
        renderWatchlist();
    }
});

function renderMovieEntry(movieData) {
    const {Title, Runtime, Genre, imdbRating, imdbID} = movieData;
    let {Poster, Plot} = movieData;
    if (Poster === "N/A") {Poster = "images/background-ensmalled.png"};
    if (Plot === "N/A") {Plot = "Plot summary not available."}
    watchlistContainer.innerHTML += `
    <div class="search-result">
        <img class="poster" src="${Poster}" alt="Poster not available">
        <div class="movie-details-container">
            <div class="movie-title-container">
                <h4 class="movie-title">${Title}</h4>
                <i class="fas fa-star star"></i>
                <p class="movie-rating">${imdbRating}</p>
            </div>
            <div class="movie-genre-container">
                <p class="movie-runtime">${Runtime}</p>
                <p class="movie-genres">${Genre}</p>
                <label><button class="add-btn" data-remove="${imdbID}">-</button>Remove</label>
            </div>
            <p class="movie-plot">${Plot}</p>
        </div>
    </div>
    <hr>`;
};



function renderWatchlist() {
    const stringFormatRegex = /^tt\d{7,9}$/;
    let watchListIsEmpty = true;
    watchlistContainer.innerHTML = ``;
    if (localStorage.length) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = JSON.parse(localStorage.getItem(key));
            if (stringFormatRegex.test(key)) {
                renderMovieEntry(value)
            }
        }
    } else {
        watchlistContainer.innerHTML = `
        <p class="empty-container-text">Your watchlist is looking a little empty...</p>
        <a href="index.html">
            <button class="add-btn">+</button>
            <p class="add-movies-text">Let's add some movies!</p>
        </a>`
    }
    //renderPagination();
}



/*function renderPagination(numSearchResults) {
    let proximatePages = [];
    let lastPage = Math.floor(numSearchResults / 10);
    if (numSearchResults % 10) {
        lastPage++
    }
    pagination.innerHTML = `<button data-page="1" class="pagination-btn"><<</button>`
    for (let i = currentPage - 3; i < currentPage + 7; i++) {
        if (i > 0 && i <= lastPage && proximatePages.length < 7) {
            proximatePages.push(i)
        }
    }
    pagination.innerHTML += proximatePages.map(pageNum => {
        let additionalClass
        if (pageNum == currentPage) {
            additionalClass = 'highlighted';
        }
        return `<button data-page="${pageNum}" class="pagination-btn ${additionalClass}">${pageNum}</button>`
    }).join('') + `<button data-page="${lastPage}" class="pagination-btn">>></button>`
}*/

renderWatchlist()