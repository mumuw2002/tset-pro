const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'googleEmail' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ googleEmail: email });
      if (!user) {
        return done(null, false, { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleEmail: profile.emails[0].value });
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          googleId: profile.id,
          googleEmail: profile.emails[0].value,
          username: profile.displayName || 'User',
          profileImage: profile.photos[0]?.value || '/img/profileImage/Profile.jpeg',
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;