require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');
const { validationSignIn, validationSignUp } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cors({
  origin: ['http://localhost:3001',
    'http://localhost:3000',
    'https://api.domainandrey.students.nomoredomains.rocks',
    'http://api.domainandrey.students.nomoredomains.rocks',
    'https://domainandrey.students.nomoredomains.rocks',
    'http://domainandrey.students.nomoredomains.rocks'],
  credentials: true,
  preflightContinue: false,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
  optionsSuccessStatus: 204,
}));

/**  подключаемся к серверу mongo */
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

const { PORT = 3000 } = process.env;

/** подключаем мидлвары, роуты и всё остальное... */
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validationSignUp, createUser);
app.post('/signin', validationSignIn, login);

// app.use(limiter);
// app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app слушает порт: ${PORT}`);
});
