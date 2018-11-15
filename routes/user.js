const express = require("express");
const router = express.Router();
const mongosee = require("mongoose");
const { User } = require("../model/UserModel");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjecId = require("../middleware/validateObjectId");

/*GET find all Users | {ROLE: ADMIN} is required*/
router.get("/", auth, admin, async (req, res, next) => {
  let users = await User.find().select("-password");
  res.send(users);
});

/*GET detail about user is requested by authentication*/
router.get("/me", auth, async (req, res) => {
    User.findById(req.user._id).select("-password")
        .then(user => res.send(user))
        .catch(() => res.status(500).send({error: "Unexpected Error"}));
});

/*Get find single user | {ROLE: ADMIN} is required*/
router.get("/:id", [auth, admin, validateObjecId], async (req, res) => {
  let id = req.params.id;
  /*Find user by id*/
  let user = await User.findById(id).select('-password');

  /*If User Found, return it!*/
  if (user) {
    return res.send(user);
  }
  /*Return 404 if user not found*/
  res.status(404).send({ error: "User Not Found" });
});

module.exports = router;
