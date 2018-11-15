const mongoose = require("mongoose");
const Joi = require("joi");

const carSchema = mongoose.Schema({
  /*Property Name Of Car*/
  carName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  /*Property Type Of Car Referenced to CarTypeModel*/
  carType: {
    type: {},
    required: true
  },
  /*Property color of car*/
  color: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  /*Property acceleration of car*/
  accelerationType: {
    type: String,
    enum: ["MANUAL", "MATIC"]
  },
  /*Property total chairs on car*/
  sheet: {
    type: Number,
    required: true
  },
  /*Property price rent per hours*/
  price: {
    type: Number,
    required: true
  }
});

const Car = mongoose.model("Car", carSchema);

function validateSchema(car) {
  const schema = {
    carName: Joi.string()
      .min(2)
      .required(),
    color: Joi.string()
      .min(3)
      .required(),
    accelerationType: Joi.string().valid(["MANUAL", "MATIC"])
      .required(),
    sheet: Joi.number().required(),
    price: Joi.number().required(),
      carType: Joi.object(),
  };
  return Joi.validate(car, schema);
}

exports.carSchema = carSchema;
exports.validate = validateSchema;
exports.Car = Car;
