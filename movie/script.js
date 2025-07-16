
const API_URL = "https://www.omdbapi.com/";

// DOM
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const movieListContainer = document.getElementById("movie-list");
const statusMessage = document.getElementById("status-message");
const modal = document.getElementById("movie-detail-modal");
const modalContent = document.getElementById("modal-content");
const closeModalButton = document.getElementById("close-modal-button");

// Run search when the 'Enter' key is pressed
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Handle clicks within the movie list (to show details)
movieListContainer.addEventListener("click", (e) => {
  const movieCard = e.target.closest(".movie-card");
  if (movieCard) {
    const imdbID = movieCard.dataset.imdbid;
    fetchAndShowMovieDetails(imdbID);
  }
});

// Close the modal when the close button is clicked
closeModalButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Close the modal when click on the overlay area outside the modal content
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

// Main function to handle the movie search process.
const handleSearch = () => {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    // Do nothing if the input is empty
    statusMessage.textContent = "Please type a movie title to start searching.";
    movieListContainer.innerHTML = "";
    return;
  }
  fetchMovies(searchTerm);
};

// Fetches a list of movies from ODMB API
const fetchMovies = async (searchTerm) => {
  // Inform the user that the application is working.
  statusMessage.textContent = "Searching...";
  movieListContainer.innerHTML = ""; // Clear old results

  try {
    // Fetch API
    const response = await fetch(
      `${API_URL}?s=${searchTerm}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      statusMessage.textContent = ""; // Clear status message on success
      displayMovies(data.Search);
    } else {
      // Display the error provided by the API (e.g., "Movie not found")
      statusMessage.textContent = `Error: ${data.Error}`;
    }
  } catch (error) {
    // Error handling (Network/Other)
    console.error("An error occured during fetch:", error);
    statusMessage.textContent =
      "Failed to connect to the server. Please try again.";
  }
};

const displayMovies = (movies) => {
  movieListContainer.innerHTML = "";
  movies.forEach((movie) => {
    // Create an HTML element for each movie
    const movieCard = document.createElement("div");
    // add clasess for style and a data-attribute to store the movie's unique ID.
    movieCard.className =
      "movie-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-lg";
    movieCard.dataset.imdbid = movie.imdbID ;

    // Use "onerror" to display a placeholder if the poster fails to load.
    const posterHTML =
      movie.Poster !== "N/A"
        ? `<img src="${movie.Poster}" alt="Poster for ${movie.Title}" class="w-full h-auto object-cover" style="min-height: 400px;" onerror="this.parentElement.innerHTML = '<div class=\\'poster-placeholder\\'>Poster not available</div>';">`
        : `<div class="poster-placeholder">Poster not available</div>`;

    movieCard.innerHTML = `${posterHTML} <div class='p-4'>
    <h3 class="font-bold text-lg truncate">${movie.Title}</h3>
    <p class="text-sm text-gray-400">${movie.Year}</p>
    </div>`;
    movieListContainer.appendChild(movieCard);
  });
};

const fetchAndShowMovieDetails = async (imdbID) => {
  // Show the modal with a loading state
  modal.classList.remove("hidden");
  modalContent.innerHTML = `
                <div class="p-8 text-center">
                    <p class="text-xl">Loading movie details...</p>
                </div>
                <button id="close-modal-button" class="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
            `;

  // Re-assign the event listener for the newly created close button
  document
    .getElementById("close-modal-button")
    .addEventListener("click", () => modal.classList.add("hidden"));

  try {
    // Use the 'i; parameter to fetch details by IMDb ID.
    const response = await fetch(
      `${API_URL}?i=${imdbID}&plot=full&apikey=${API_KEY}`
    );
    const details = await response.json();

    if (details.Response === "True") {
      displayMovieDetails(details);
    } else {
      throw new Error(details.Error);
    }
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    modalContent.innerHTML = `
                    <div class="p-8 text-center text-red-400">
                        <p class="text-xl">Failed to load details.</p>
                        <p>${error.message}</p>
                    </div>
                     <button id="close-modal-button" class="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
                `;
    document
      .getElementById("close-modal-button")
      .addEventListener("click", () => modal.classList.add("hidden"));
  }
};

// Displays the movie details within the modal.
const displayMovieDetails = (details) => {
  const posterHTML =
    details.Poster !== "N/A"
      ? `<img src="${details.Poster}" alt="Poster for ${details.Title}" class="w-full sm:w-1/3 rounded-l-lg object-cover">`
      : `<div class="w-full sm:w-1/3 poster-placeholder flex items-center justify-center rounded-l-lg">Poster not available</div>`;

  modalContent.innerHTML = `
                <div class="flex flex-col sm:flex-row">
                    ${posterHTML}
                    <div class="p-6 sm:p-8 flex-1">
                        <h2 class="text-3xl font-bold text-yellow-400 mb-2">${details.Title} (${details.Year})</h2>
                        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
                            <span>${details.Rated}</span>
                            <span>&bull;</span>
                            <span>${details.Runtime}</span>
                            <span>&bull;</span>
                            <span>${details.Genre}</span>
                        </div>
                        <div class="mb-4">
                            <h4 class="font-semibold mb-1">Plot</h4>
                            <p class="text-gray-300 text-sm">${details.Plot}</p>
                        </div>
                        <div class="mb-4">
                            <h4 class="font-semibold mb-1">Director</h4>
                            <p class="text-gray-300 text-sm">${details.Director}</p>
                        </div>
                        <div class="mb-4">
                            <h4 class="font-semibold mb-1">Actors</h4>
                            <p class="text-gray-300 text-sm">${details.Actors}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-1">IMDb Rating</h4>
                            <p class="text-gray-300 font-bold text-lg">${details.imdbRating} / 10</p>
                        </div>
                    </div>
                </div>
                <button id="close-modal-button" class="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
            `;
  // Re-assign the event listener for the newly created close button
  document
    .getElementById("close-modal-button")
    .addEventListener("click", () => modal.classList.add("hidden"));
};

// Run search when the 'Search' button is clicked
searchButton.addEventListener("click", handleSearch);
