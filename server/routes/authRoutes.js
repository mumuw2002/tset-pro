//server\routes\authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// เรียก Google Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/space');
  }
);


// Local Authentication
router.get("/login", authController.loginPage);
router.post("/login", authController.login);

router.get('/register', authController.registerForm);
router.post('/register', authController.registerUser);

router.get("/logout", authController.logout);

module.exports = router;
