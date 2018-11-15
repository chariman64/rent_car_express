const express = require("express");
const router = express.Router();
const { CarType, validate } = require("../model/CarTypeModel");
const _ = require("lodash");
const auth = require("../middleware/auth");
const cs = require("../middleware/customerService");
const validateObjectId = require("../middleware/validateObjectId");

/*POST create new car types | (Role: ADMIN|CS) is required*/
router.post("/", auth, cs, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let carType = await CarType.findOne({ carType: req.body.carType });

  if (carType)
    return res.status(400).send({ error: "Car Type Name Must Be Unique" });

  carType = new CarType(_.pick(req.body, ["carType"]));

  await carType.save();
  res.send(carType);
});

router.get("/", async (req, res) => {
  let carTypes = await CarType.find();
  res.send(carTypes);
});

/*GET find car type by id*/
router.get("/:id", validateObjectId, async (req, res) => {
  let carType = await CarType.findById(req.params.id);
  if (!carType) res.status(404).send({ error: "Car Type Not Found" });
  res.send(carType);
});

/*DELETE car type by id | {ROLE:ADMIN|CS} is required*/
router.delete("/:id", [auth, cs, validateObjectId], async (req, res) => {
  CarType.findById(req.params.id)
    .then(carType => {
      carType.delete();
      res.send({ message: "User Deleted." });
    })
    .catch(() => res.status(404).send({ error: "User Not Found." }));
});

/*PUT update car type | {Role: ADMIN|CS} is required*/
router.put("/:id", [auth, cs, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  CarType.findByIdAndUpdate(
    req.params.id,
    { carType: req.body.carType },
    { new: true }
  )
    .then(carType => res.send(carType))
    .catch(() => res.status(404).send({ error: "Car Type Not Found" }));
});

module.exports = router;
