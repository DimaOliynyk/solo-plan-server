const express = require('express');
const { auth } = require('../middlewares');
const { authControllers } = require('../controllers');
const { schemaValidate } = require('../middlewares');
const { authValidator } = require('../validationSchemas');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

router.post('/register', schemaValidate(authValidator.authRegister), authControllers.register);

router.post('/login', schemaValidate(authValidator.authLogin), authControllers.login);

router.get('/me', auth, authControllers.me);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    try {
      const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.redirect(`http://localhost:3000/home-redirect?token=${token}`);
    } catch (err) {
      console.error("Callback error:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/info", (req, res) => {
    const status = {
      "Status": "Running"
    };

    res.send(status);
});

module.exports = router;