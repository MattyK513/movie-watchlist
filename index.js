const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');
const pagination = document.getElementById('pagination');
let currentPage = 1;

searchBtn.addEventListener('click', () => {
    currentPage = 1;
    searchDatabase(currentPage);
});

document.addEventListener('click', e => {
    if (e.target.dataset.add) {
        fetch(`https://www.omdbapi.com/?apikey=52568e5d&i=${e.target.dataset.add}`)
            .then(res => res.json())
            .then(data => {
                const {Title, Runtime, Genre, imdbRating, imdbID} = data;
                let {Poster, Plot} = data;
                if (Poster === "N/A") {Poster = "images/background-ensmalled.png"};
                if (Plot === "N/A") {Plot = "Plot summary not available."}
                const movieDataString = JSON.stringify({Title, Runtime, Genre, imdbRating, imdbID, Poster, Plot});
                localStorage.setItem(`${imdbID}`, movieDataString);
            })
    }
})

document.addEventListener('click', e => {
    if (e.target.dataset.page) {
        currentPage = parseInt(e.target.dataset.page);
        searchDatabase(currentPage)
    }
})


function searchDatabase(resultPage) {
    fetch(`https://www.omdbapi.com/?apikey=52568e5d&s=${searchInput.value}&page=${resultPage}`)
    .then(res => res.json())
    .then(data => {
        if (data.Response === "True") {
            renderPagination(parseInt(data.totalResults))
            searchResultsContainer.innerHTML = ``;
            data.Search.map(movie => {
                fetch(`https://www.omdbapi.com/?apikey=52568e5d&i=${movie.imdbID}`)
                .then(res => res.json())
                .then(data => {
                    renderMovies(data);
                })
            })
        } else {
            searchResultsContainer.innerHTML = `
            <p class="empty-container-text">Unable to find what you're looking for. Please try another search.</p>`
        }
    })
};

function renderMovies(movieData) {
    const {Title, Runtime, Genre, imdbRating, imdbID} = movieData;
    let {Poster, Plot} = movieData;
    if (Poster === "N/A") {Poster = "images/background-ensmalled.png"};
    if (Plot === "N/A") {Plot = "Plot summary not available."}
    searchResultsContainer.innerHTML += `
    <div class="search-result">
        <img class="poster" src="${Poster}" alt="Poster not available">
        <div class="movie-details-container">
            <div class="movie-title-container">
                <a href="https://www.imdb.com/title/${imdbID}/" target="_blank">
                    <h4 class="movie-title">${Title}</h4>
                </a>
                <i class="fas fa-star"></i>
                <p class="movie-rating">${imdbRating}</p>
            </div>
            <div class="movie-genre-container">
                <p class="movie-runtime">${Runtime}</p>
                <p class="movie-genres">${Genre}</p>
                <label><button class="add-btn" data-add="${imdbID}">+</button>Watchlist</label>
            </div>
            <p class="movie-plot">${Plot}</p>
            <a href="https://www.imdb.com/title/${imdbID}/" target="_blank" class="read-more-link">
        </div>
    </div>
    <hr>`;
};

function renderPagination(numSearchResults) {
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
}
