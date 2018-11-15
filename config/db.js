const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
    /* Database Configuration*/
    mongoose.connect('mongodb://localhost/rent_car')
        .then(() => winston.debug('Connected to MongoDB...'));
};