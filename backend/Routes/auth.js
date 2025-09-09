const { 
  register, 
  login, 
  forgotPassword, 
  verifyResetToken, 
  resetPassword 
} = require("../Controllers/auth_controller");

const {
  registerValidation, 
  loginValidation,
  forgotPasswordValidation,
  verifyTokenValidation,
  resetPasswordValidation
} = require("../Middleware/auth_validation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);
router.post("/forgotpassword", forgotPasswordValidation, forgotPassword);
router.post("/verifytoken", verifyTokenValidation, verifyResetToken);
router.post("/resetpassword", resetPasswordValidation, resetPassword);

module.exports = router;