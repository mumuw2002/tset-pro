// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt'); // อย่าลืมติดตั้ง bcrypt ด้วยนะครับ


exports.loginPage = (req, res) => {
  res.render('log/login', { 
    title: 'เข้าสู่ระบบ', 
    description: 'เข้าสู่ระบบ Task Management App',
    error: req.flash('error') 
  });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/space',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

exports.registerForm = (req, res) => {
  res.render('log/register', { 
    title: 'สมัครสมาชิก', 
    description: 'สมัครสมาชิก Task Management App' 
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password, confirmPassword, googleEmail } = req.body;

    // ตรวจสอบความถูกต้องของข้อมูล
    const errors = [];
    if (password !== confirmPassword) {
      errors.push('รหัสผ่านไม่ตรงกัน');
    }
    if (password.length < 8) {
      errors.push('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
    }
    if (errors.length > 0) {
      return res.render('log/register', { 
        errors, 
        username, 
        googleEmail, 
        password, 
        confirmPassword 
      });
    }

    // ตรวจสอบว่ามีอีเมลนี้อยู่ใน database หรือยัง
    const existingUser = await User.findOne({ googleEmail: googleEmail });
    if (existingUser) {
      req.flash('error', 'อีเมลนี้ถูกใช้ไปแล้ว');
      return res.redirect('/register');
    }

    // Hash รหัสผ่าน
    const saltRounds = 10; // กำหนดจำนวน salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds); 

    // สร้าง user ใหม่
    const user = new User({
      username,
      googleEmail,
      password: hashedPassword // บันทึกรหัสผ่านที่ hash แล้ว
    });
    await user.save();

    req.flash('success_msg', 'สมัครสมาชิกเรียบร้อยแล้ว!');
    res.redirect('/login'); 

  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // duplicate key error
      req.flash('error', 'อีเมลนี้ถูกใช้ไปแล้ว');
    } else {
      req.flash('error', 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
    res.redirect('/register');
  }
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};