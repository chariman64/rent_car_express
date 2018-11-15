/* All Route Is Called From Here Through Rest API  */

/* Import The Route Model */
const express = require('express');
const homeRouter = require('./home');
const authRouter = require('./auth');
const userRouter = require('./user');
const carTypeRouter = require('./cartype');
const carRouter = require('./cars');

/* Declare The Route, Make Accessible From Rest API*/
module.exports = (app) => {
    app.use(express.json());
    app.use('/', homeRouter);
    app.use('/api/auth/', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/cartypes', carTypeRouter);
    app.use('/api/cars', carRouter);
};
