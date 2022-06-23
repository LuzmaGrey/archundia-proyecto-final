const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "d481d5f4366b445ff12e7c51a962162d";
let MOVIE_ID = "";

document.addEventListener("DOMContentLoaded", () => {
    MOVIE_ID = getUrlVars().id;
    renderMovieDetails(MOVIE_ID);
});



// para recoger los datos (id) de la pelicula 
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
         vars[key] = value;
    });
    return vars;
}

//obtener 
const getMovieDetails = (movieId) => {
    const url = `${URL_PATH}/3/movie/${movieId}?api_key=${API_KEY}&language=es-ES`;

    return fetch(url)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log(error))
}
// renderizar o generar 
const renderMovieDetails = async(movieId) => {
    const movieDetails = await getMovieDetails(movieId);
    const { backdrop_path, poster_path, title, overview, genres, release_date } = movieDetails;
    renderBackground(backdrop_path);
    renderPoster(poster_path, title);
    renderMovieData(title, overview, genres, release_date);
    getTeaser(movieId);
}

// pintar el background de la pagina con la img de la pelicula 
const renderBackground = (backdrop_path) => {
    const urlBackground = `https://image.tmdb.org/t/p/original${backdrop_path}`;

    document.getElementsByClassName('movie-info')[0].style.backgroundImage = `url(${urlBackground})`; //style.backgroundImage propiedadde fondo
}

//construir la URL del poster_path
const renderPoster = (poster_path, title) => {
    const urlPoster = `https://image.tmdb.org/t/p/original${poster_path}`;

    const html = `<img src="${urlPoster}" class="img-fluid movie-info__poster-img" alt="${title}" />`;
    document.getElementsByClassName('movie-info__poster')[0].innerHTML = html;
}

// obtener la información de la pelicula
const renderMovieData = (title, overview, genres, release_date) => {
    const dataSplit = release_date.split('-');
    let htmlGenres = "";

    genres.forEach(genre => {
        htmlGenres += `<li>${genre.name}</li>`;
    });
    const html = `
            <h1>
                ${title}
                <span class="date-any">${dataSplit[0]}</span>
                <span class="teaser" data-toggle="modal" data-target="#video-teaser">
                <i class="fas fa-play"></i> Ver Trailer
                </span>
            </h1>
            <h5>General</h5>
            <p>${overview}</p>
            <ul>
                ${htmlGenres}
            </ul>`;
    
    document.getElementsByClassName('movie-info__data')[0].innerHTML = html;
}

//información del trailer de la pelicula
const getTeaser = (movieId) => {
    const url = `${URL_PATH}/3/movie/${movieId}/videos?api_key=${API_KEY}&language=es-ES`;

    return fetch(url)
        .then(response => response.json())
        .then(result => {renderTeaser(result)})
        .catch(error => console.log(error))
}

const renderTeaser = (objVideo) => {
    let keyVideo = "";

    objVideo.results.forEach(video => {
        if(video.type === "Trailer" && video.site === "YouTube") {
            keyVideo = video.key;
        }
    });

    let urlIframe ="";
    if(keyVideo !== "") {
        urlIframe = `
        <iframe width="100%" height="415px" src="https://www.youtube.com/embed/${keyVideo}"
        frameborder="0" allow="accelerometer"; autoplay; ecrypted-media
        gryscope; picture-in-pincture"allowfullscreen></iframe>`;
    }else {
        urlIframe = "<div class='no-teaser'>La pelicula no tiene trailer</div>";
    }
    document.getElementsByClassName('video-teaser-iframe')[0].innerHTML = urlIframe; 
}