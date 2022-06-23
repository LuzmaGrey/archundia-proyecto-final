const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "d481d5f4366b445ff12e7c51a962162d";
// evento para que cuando la pagina cargue aparezca
document.addEventListener("DOMContentLoaded", () => {
    renderNewsMovies();
    renderListMovie('popular', 'now-playing__list'); //obtener 5 peliculas mas populares
    renderListMovie('top_rated', 'top-rated-playing__list'); //obtener 5 peliculas mejores punteadas
})

// metodo para devolver todas las peliculas
const getMovies = (type) => {
    const url = `${URL_PATH}/3/movie/${type}?api_key=${API_KEY}&language=es-ES&page=1`;
    //petición fetch
    return fetch(url)
        .then(response => response.json())
        .then(result => result.results)
        .catch(error => console.log(error))
}

// generar el slaider para mostrar las peliculas 
const renderNewsMovies = async () => {
    const newMovies = await getMovies('now_playing'); // devuelve un array con las peliculas 
    let html = '';

    newMovies.forEach((movie, index) => {
        const { id, title, overview, backdrop_path } = movie; // utilizando metodo destuturing, se obtiene un objeto con cada valor
        const urlImage = `https://image.tmdb.org/t/p/original${backdrop_path}`;
        const urlMovie = `../movie.html?id=${id}`;
        html += `    
            <div class="carousel-item ${index === 0 ? "active" : null}" style="background-image: url('${urlImage}')">   
            </div>`; // se necesita solo la primera imagen con la clase active
    });

    html += `
        <a class="carousel-control-prev" href="#carousel-news-movies" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Anterior</span>
        </a>
        <a class="carousel-control-next" href="#carousel-news-movies" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Siguiente</span>
        </a>` // las fechas para correr la imagen

    document.getElementsByClassName('list-news-movies')[0].innerHTML = html;
}

const renderListMovie = async (type, className) => {
    const movies = await getMovies(type);
    let html = "";

    movies.forEach((movie, index) => {
        const { id, title, poster_path } = movie;
        const movieCover = `https://image.tmdb.org/t/p/original${poster_path}`;
        const urlMovie = `../movie.html?id=${id}`;

        // solo se quiere 5 elementos
        if (index < 5) {
            html += `
                <li class="list-group-item">
                    <img src="${movieCover}" alt="${title}">
                    <h3>${title}</h3>
                    <a href="${urlMovie}" class="btn btn-primary">Ver Más</a>
                </li>`;
        }
        document.getElementsByClassName(className)[0].innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let { page } = getUrlVars();
    page == undefined ? page = 1 : null; //si la url viene sin page, entonces se asigna el valor a page.
    renderPopularMovies(page);
    renderControls(page);
});

// para recoger los datos (id) de la pelicula 
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

const getPopularMovies = (page) => {
    const url = `${URL_PATH}/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;

    return fetch(url)
        .then(response => response.json())
        .then(result => result.results)
        .catch(error => console.log(error))
}

const renderPopularMovies = async (page) => {
    const movies = await getPopularMovies(page);
    let html = "";

    movies.forEach(movie => {
        const { id, title, poster_path } = movie;
        const urlImage = `https://image.tmdb.org/t/p/w500${poster_path}`;
        const urlMoreInfo = `../movie.html?id=${id}`;

        html += `
            <div class="col-3 col-custom">
                <a href="${urlMoreInfo}" class="card custom-card">
                    <img src="${urlImage}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title text-center m-0">${title}</h5>
                    </div>
                </a>
            </div>`;
    });
    document.getElementsByClassName('list-cards')[0].innerHTML = html;
}

const renderControls = (page) => {
    const baseUrlPage = "../popular.html?page=";
    const pageNumber = parseInt(page);
    const previus = pageNumber - 1;
    const next = pageNumber + 1;

    let html = "";

    if (page == 1) {
        html = `
            <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                    <a class="page-link" href="#">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
                <li class="page-item active">
                    <a class="page-link" href="${baseUrlPage + "1"}">1</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + "2"}">2</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + "3"}">3</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + "2"}">
                        <i class="fas fa-chevron-right"></i>  
                    </a>
                </li>
            </ul>`;
    } else {
        html = `
            <ul class="pagination justify-content-center">
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + previus}">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + previus}">${previus}</a>
                </li>
                <li class="page-item active">
                    <a class="page-link" href="${baseUrlPage + page}">${page}</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + next}">${next}</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="${baseUrlPage + next}">
                        <i class="fas fa-chevron-right"></i>  
                    </a>
                </li>
            </ul>`;
    }
    document.getElementsByClassName('navigation')[0].innerHTML = html;
}
