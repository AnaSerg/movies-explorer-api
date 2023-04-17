const jwt = require('jsonwebtoken');
const JWT = require('../utils/constants');

const { NODE_ENV, JWT_SECRET = 'some-secret-key' } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('При авторизации произошла ошибка. Токен не передан или передан не в том формате.'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT);
  } catch (err) {
    return next(new UnauthorizedError('При авторизации произошла ошибка. Переданный токен некорректен.'));
  }

  req.user = payload;
  return next();
};
