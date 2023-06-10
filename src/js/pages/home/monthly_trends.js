const axios = require('axios').default;
import { optionsUpcoming } from '../../request';
import { optionsGenre } from '../../request';

const containerMovie = document.querySelector('.container-upcoming-movie');

async function fetchUpcomingMovie() {
  try {
    const response = await axios.request(optionsUpcoming);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchGenresMovie() {
  try {
    const genres = await axios.request(optionsGenre);
    return genres.data.genres;
  } catch (error) {
    console.log(error);
  }
}

async function responseUpcoming() {
  const data = await fetchUpcomingMovie();
  const movieInfo = data.results;
  const genres = await fetchGenresMovie();
  generateGenres(movieInfo, genres);
  containerMovie.innerHTML = createMarkupUpcoming(movieInfo, genres);
}

function generateGenres(movieInfo, genres) {
  const genresName = [];
  movieInfo.forEach(movie => {
    const genreNames = [];
    movie.genre_ids.forEach(genreId => {
      const genre = genres.find(genre => genre.id === genreId);
      if (genre) {
        genreNames.push(genre.name);
      }
    });
    genresName.push(genreNames.join(', '));
  });
}

function createMarkupUpcoming(movieInfo, genres) {
  const randomIndex = Math.floor(Math.random() * movieInfo.length);
  const {
    backdrop_path,
    original_title,
    release_date,
    vote_average,
    vote_count,
    popularity,
    genre_ids,
    overview,
  } = movieInfo[randomIndex];
  const galleryPoster = './images/coming_soon.jpg';
  const poster = backdrop_path
    ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
    : galleryPoster;

  const roundedPopularity = popularity.toFixed(1);

  const releaseDay = addLeadingZero(
    Math.floor(new Date(Date.parse(release_date)).getDay() || '')
  );
  const releaseMonth = addLeadingZero(
    Math.floor(new Date(Date.parse(release_date)).getMonth() || '')
  );
  const releaseYear = addLeadingZero(
    Math.floor(new Date(Date.parse(release_date)).getFullYear() || '')
  );

  const genreNames = genre_ids.map(genreId => {
    const genre = genres.find(genre => genre.id === genreId);
    return genre ? genre.name : '';
  });

  return `
    <img class="upcoming-image" src="${poster}" alt="${original_title}">
    <h3 class="upcoming-movie-title">${original_title}</h3>
    <ul class="upcoming-list-details list">
      <li class="upcoming-list-details-item">
        <p class="upcoming-list-details-subtitle">Release date</p>
        <p class="upcoming-realese-date">${releaseDay}.${releaseMonth}.${releaseYear}</p>
      </li>
      <li class="upcoming-list-details-item">
        <p class="upcoming-list-details-subtitle">Vote / Votes</p>
        <p class="upcoming-votes"><span>${vote_average}</span> / <span>${vote_count}</span></p>
      </li>
      <li class="upcoming-list-details-item">
        <p class="upcoming-list-details-subtitle">Popularity</p>
        <p class="upcoming-popularity">${roundedPopularity}</p>
      </li>
      <li class="upcoming-list-details-item">
        <p class="upcoming-list-details-subtitle">Genre</p>
        <p class="genre">${genreNames.join(', ')}</p>
      </li>
    </ul>
    <h4 class="upcoming-about">ABOUT</h4>
    <p class="upcoming-about-text">${overview}</p>
    <button class="btn upcoming-btn-add orange-btn" type="button">Add to my library</button>
    <button class="btn upcoming-btn-remove transparent-btn" hidden type="button">Remove from my library</button>
  `;
}

responseUpcoming();

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
// BUTTON//

containerMovie.addEventListener('click', function (event) {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains('upcoming-btn-add')) {
    addToLocalStorage(event);
  } else if (target.classList.contains('upcoming-btn-remove')) {
    removeFromLocalStorage(event);
  }
});

function addToLocalStorage(e) {
  const addToLibraryBtn = e.target;
  addToLibraryBtn.style.display = 'none';
  const removeFromLibraryBtn = addToLibraryBtn.parentNode.querySelector(
    '.upcoming-btn-remove'
  );
  removeFromLibraryBtn.style.display = 'block';
}

function removeFromLocalStorage(e) {
  removeFromLibraryBtn = e.target;
  removeFromLibraryBtn.style.display = 'none';
  const addToLibraryBtn =
    removeFromLibraryBtn.parentNode.querySelector('.upcoming-btn-add');
  addToLibraryBtn.style.display = 'block';
}
