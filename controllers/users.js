const { NODE_ENV, JWT_SECRET = 'some-secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const JWT = require('../utils/constants');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, password, email,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('При регистрации пользователя произошла ошибка.'));
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Вы ввели неправильный логин или пароль.'));
    });
};
