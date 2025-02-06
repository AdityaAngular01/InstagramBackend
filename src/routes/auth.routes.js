const { newUser, login } = require("../controller/auth.controller");

const router = require("express").Router();

const { ValidateJoi, Schemas } = require("../middleware/model.validation");

router
	.post("/signup", ValidateJoi(Schemas.userSchema), newUser)
	.post("/login", ValidateJoi(Schemas.userLogin), login);

module.exports = router;
