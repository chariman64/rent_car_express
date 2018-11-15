const Joi = require('joi');
const mongoose = require('mongoose');

const carTypeSchema = new mongoose.Schema({
   carType: {
       type: String,
       required: true,
       minlength: 2,
       maxlength: 15
   }
});

const CarType = mongoose.model('CarType', carTypeSchema);

function validateSchema(carType) {
    const schema = {
        carType: Joi.string().min(2).required()
    };
    return Joi.validate(carType, schema);
}

exports.carTypeSchema = carTypeSchema;
exports.CarType = CarType;
exports.validate = validateSchema;