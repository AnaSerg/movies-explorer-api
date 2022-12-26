const { Router } = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');

const movieRouter = Router();
movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateCreateMovie, createMovie);
movieRouter.delete('/movies/_id', validateIdMovie, deleteMovie);