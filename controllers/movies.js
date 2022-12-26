const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

 Movie.create({ owner, ...req.body })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Невозможно удалить чужой фильм.');
      }
      return movie.remove().then(() => res.status(200).send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Abkmv с указанным _id не найден.'));
      }
      return next(err);
    });
};
