const { Router } = require('express');
const {
  validateCreateMovie,
  validateIdMovie,
} = require('../middlewares/validation');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const movieRouter = Router();
movieRouter.get('/', getMovies);
movieRouter.post('/', validateCreateMovie, createMovie);
movieRouter.delete('/:movieId', validateIdMovie, deleteMovie);

module.exports = movieRouter;
