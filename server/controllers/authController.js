const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // เพิ่มบรรทัดนี้
const User = require('../models/User'); // ตรวจสอบเส้นทางให้ถูกต้อง

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
        const googleEmail = profile.emails?.[0]?.value || 'no-email'; // จัดการกรณีไม่มีอีเมล
        const profileImage = profile.photos?.[0]?.value || '/img/profileImage/Profile.jpeg'; // จัดการกรณีไม่มีรูป

        const existingUser = await User.findOne({ googleEmail });
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          googleId: profile.id,
          googleEmail,
          username: profile.displayName || 'User',
          profileImage,
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'googleEmail' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ googleEmail: email });
      if (!user) {
        return done(null, false, { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }

      if (!user.password) {
        return done(null, false, { message: 'บัญชีนี้ไม่ได้ลงทะเบียนด้วยอีเมลและรหัสผ่าน' });
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