# JS Project Collection

This repository contains a collection of simple JavaScript projects created for learning and practice purposes, with the assistance of AI.

## Projects

This collection includes two main projects:

1.  **To-Do List App**: A client-side to-do list application to help you manage your daily tasks.
2.  **Movie Finder**: An application that allows you to search for movies and view their details using the OMDb API.

-----

## 1\. To-Do List App

A sleek and modern to-do list application with persistent storage.

### Features

  * **Add Tasks**: Quickly add new tasks to your list.
  * **Edit Tasks**: Click the edit button to modify the text of an existing task.
  * **Complete Tasks**: Mark tasks as completed with a checkbox.
  * **Delete Tasks**: Remove tasks you no longer need.
  * **Filter Views**: Filter tasks by "All", "Active", and "Completed" statuses.
  * **Task Counter**: See how many active tasks are left.
  * **Clear Completed**: Easily remove all completed tasks with a single button.
  * **Local Storage**: Your tasks are saved in your browser's local storage, so they persist even after you close the page.

### Technologies Used

  * HTML5
  * Tailwind CSS
  * JavaScript (ES6+)
  * Phosphor Icons

### How to Run

1.  Clone this repository.
2.  Navigate to the `todolist` directory.
3.  Open the `index.html` file in your web browser.

-----

## 2\. Movie Finder

An application to search for movies and view detailed information.

### Features

  * **Search Movies**: Find movies by title using the OMDb API.
  * **Movie List Display**: View search results in a clean, grid-based layout.
  * **Detailed View**: Click on any movie card to open a modal with more details, including:
      * Plot summary
      * Director and Actors
      * IMDb Rating
      * Genre, Runtime, and Rating (e.g., PG, R)
  * **Responsive Design**: The interface is optimized for both desktop and mobile devices.

### Technologies Used

  * HTML5
  * Tailwind CSS
  * JavaScript (ES6+)
  * [OMDb API](https://www.omdbapi.com/)

### How to Run

1.  Clone this repository.
2.  Go to [OMDb API](https://www.omdbapi.com/apikey.aspx) and get your free API key.
3.  In the `movie` directory, create a new file named `config.js`.
4.  Inside `config.js`, add the following line, replacing `'YOUR_API_KEY'` with the key you obtained:
    ```javascript
    const API_KEY = 'YOUR_API_KEY';
    ```
5.  Save the file.
6.  Open the `index.html` file in the `movie` directory in your web browser.

-----

### Disclaimer

This was a fun project I built to learn and experiment, primarily with the assistance of an AI.
