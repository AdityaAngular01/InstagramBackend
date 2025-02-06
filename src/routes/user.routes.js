const { Schemas, ValidateJoi } = require("../middleware/model.validation");

const {
	getUserInfo,
	deleteAccount,
	updateProile,
	searchUser,
} = require("../controller/user.controller");

const router = require("express").Router();

router
	.get("/info", getUserInfo)
	.get("/search", ValidateJoi(Schemas.searchUser), searchUser)
	.delete("/delete/account", deleteAccount)
	.put("/update/profile", ValidateJoi(Schemas.updateProfile), updateProile);

module.exports = router;
