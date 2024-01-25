const $bttnSearch = document.getElementById('button-search');
const $overlayModal = document.getElementById('modal-overlay');

const $movieName = document.getElementById('movie-name');
const $movieYear = document.getElementById('movie-year');

const $sectionMovieList = document.getElementById('movie-list');

let movieList = JSON.parse(localStorage.getItem("movieList")) ?? []; /* Operador que faz com que a lista nunca receba valor null, mesmo com o local storage vazio. */

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { 
      searchButtonClickHandler();
    }
})

async function searchButtonClickHandler() {
    try {
        let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}&y=${movieYearParameterGenerator()}`;
        const resposta = await fetch(url);
        const data = await resposta.json();

        if (data.Error) {
            throw new Error('Movie not found. Make sure it has the original title.');
        }
        createModal(data);
        $overlayModal.classList.add('overlay-visible');

    } catch (error){
        notie.alert({type: 'error',
        text: error.message});
    }
}

function movieNameParameterGenerator() {
    if($movieName.value === '') {
        throw new Error('The name of the movie must be provided.');
    }
    
    return $movieName.value.split(' ').join('+');
}

function movieYearParameterGenerator() {
    if($movieYear.value === '') {
        return '';
    }

    if (Number($movieYear.value) <= 1900 || Number($movieYear.value) > 2025 || Number.isNaN(Number($movieYear.value))) {
        throw new Error('Year invalid.');
    }

    return $movieYear.value;
}

function addToList(movieObject) {
    movieList.push(movieObject);
}

function isMovieAlreadyOnList(id) {
    function doesThisIdBelongToThisMovie(movieObject) {
        return movieObject.imdbID === id;
    }
    return Boolean(movieList.find(doesThisIdBelongToThisMovie));
}

function updateUI(movieObject) {
    $sectionMovieList.innerHTML += `<article id="movie-card-${movieObject.imdbID}">
    <img src="${movieObject.Poster}" alt="${movieObject.Title} poster">
    <button onclick="{removeFilmFromList('${movieObject.imdbID}')}">
        <i class="bi bi-trash3-fill"></i>
        Remove from List
    </button>
    </article>`;
}

function removeFilmFromList(id) {
    notie.confirm({text: 'Remove from List?', 
        submitText: 'Yes',
        canceltext: 'No',
        position: 'top',
        submitCallback: function remove() {
            movieList = movieList.filter(movie => movie.imdbID != id); /* só passa na filtragem se o ID for diferente e passa-os para a nova lista*/
            document.getElementById(`movie-card-${id}`).remove();
            updateLocalStorage();
        },
    });

}

function updateLocalStorage() {
    localStorage.setItem('movieList', JSON.stringify(movieList));
}

for (const movieInfo of movieList) { /* Executa toda vez que a página for montada/recarregada e monta a lista de filmes*/
    updateUI(movieInfo);
}

$bttnSearch.addEventListener('click', searchButtonClickHandler);
