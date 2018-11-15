const express = require("express");
const router = express.Router();
const { Car, validate } = require("../model/CarModel");
const mongoose = require("mongoose");
const _ = require("lodash");
const { CarType } = require("../model/CarTypeModel");
const auth = require("../middleware/auth");
const cs = require("../middleware/customerService");
const validObjectId = require("../middleware/validateObjectId");

/*GET find all cars*/
router.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);
  let page = parseInt(req.query.page);
  let cars = await Car.find()
    .limit(limit)
    .skip(page * limit);
  cars.push({ size: await Car.countDocuments() });
  res.send(cars);
  // .catch(() => res.status(500).send({ error: "Something went wrongs." }));
});

/*GET find car by id*/
router.get("/:id", validObjectId, async (req, res) => {
  let car = await Car.findById(req.params.id);
  if (!car) res.status(404).send({ error: "Car Not Found." });

  res.send(car);
});

/*POST create new car | {ROLE: ADMIN|CS} is required*/
router.post("/", [auth, cs], async (req, res) => {
  let body = req.body;

  /*Check and validate body.carType._id*/
  if (!mongoose.Types.ObjectId.isValid(body.carType._id))
    return res.status(404).send({ error: "Invalid Car Type ID." });

  /*Find Car Type*/
  let carType = await CarType.findOne(body.carType);
  /*Car Type Have No Valid Value | Not Found On DB*/
  if (!carType)
    res.status(400).send({ error: "Car Type Have No Valid Value." });

  /*Replace body.carType value with carType*/
  body.carType = carType;

  /*Validate Body, the carType will not validate from here*/
  const { error } = validate(req.body);

  /*Body Have No Valid Value*/
  if (error) res.status(400).send({ error: error.details[0].message });

  /*Create new car object with given value from body*/
  let car = new Car(
    _.pick(req.body, [
      "carName",
      "carType",
      "color",
      "sheet",
      "price",
      "accelerationType"
    ])
  );

  /*Save car object to db*/
  await car.save();
  /*Send car value already saved on db to client*/
  res.send(car);
});

/*DELETE delete car by id*/
router.delete("/:id", [auth, cs, validObjectId], async (req, res) => {
  Car.findByIdAndRemove(req.params.id)
    .then(() => res.send({ message: "Car deleted." }))
    .catch(() => res.status(404).send("Can't find related car"));
});

router.put("/:id", [auth, cs, validObjectId], async (req, res) => {
  let body = req.body;

  /*Check and validate body.carType._id*/
  if (!mongoose.Types.ObjectId.isValid(body.carType._id))
    return res.status(404).send({ error: "Invalid Car Type ID." });

  /*Find Car Type*/
  let carType = await CarType.findOne(body.carType);
  /*Car Type Have No Valid Value | Not Found On DB*/
  if (!carType)
    res.status(400).send({ error: "Car Type Have No Valid Value." });

  /*Replace body.carType value with carType*/
  body.carType = carType;

  /*Validate the body*/
  const { error } = validate(body);
  if (error) res.status(400).send({ error: error.details[0].message });

  /*Find and update the car*/
  Car.findByIdAndUpdate(req.params.id, body, { new: true })
    .then(car => res.send(car))
    .catch(() => res.status(400).message({ error: "Something went wrong!" }));
});

module.exports = router;
