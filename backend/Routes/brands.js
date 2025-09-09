const ensureAuth = require("../Middleware/auth_middleware");

const router = require("express").Router();

router.get("/", ensureAuth, (req, res) => {
    console.log('------Logged in user detail--------',req.user);
    res.status(200).json([
        {
            name:"Toyota",
            price:20000000
        },
        {
            name:"TCL",
            price: 100000
        }
     ]);
} );

module.exports = router;