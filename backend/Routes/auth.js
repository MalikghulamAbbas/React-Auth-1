const { register, login} = require("../Controllers/auth_controller");
const {registerValidation, loginValidation } = require("../Middleware/auth_validation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);

module.exports = router;