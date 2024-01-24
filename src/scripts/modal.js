const $overlay = document.getElementById('modal-overlay');
const $bgModal = document.getElementById('modal-background');
const $modalContainer = document.getElementById('modal-container');

let currentMovie = {};

function closeModal() {
    $overlay.classList.remove('overlay-visible');
}

function addCurrentMovieToList() {
    if (isMovieAlreadyOnList(currentMovie.imdbID)) {
        notie.alert({type: "error", text: "O filme já está na sua lista!"});
        return;
    }

    addToList(currentMovie);
    updateUI(currentMovie);
    updateLocalStorage();
    closeModal();
}

function createModal(data) {
    currentMovie = data;

    $modalContainer.innerHTML = `<h2 id="movie-title">${data.Title} - ${data.Year}</h2>
<section id="modal-body">
    <img id="movie-poster" src="${data.Poster}" alt="Movie poster">
    <div id="movie-info">
        <div id="movie-plot">
            <h3>Plot:</h3>
            <p>${data.Plot}</p>
        </div>
        <div id="movie-writer">
            <h3>Writer:</h3>
            <p>${data.Writer}.</p>
        </div>
        <div id="movie-type">
            <h3>Type:</h3>
            <p>${data.Type}.</p>
        </div>
        <div id="movie-genre">
            <h3>Genre:</h3>
            <p>${data.Genre}.</p>
        </div>
    </div>
</section>
<section id="modal-footer">
    <button id="add-to-list" onclick="{addCurrentMovieToList()}">Add to List</button>
</section>`;
}

$bgModal.addEventListener('click', closeModal);
