require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const helmet = require('helmet'); // เพิ่ม helmet สำหรับ CSP

require('./server/config/passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware สำหรับ parse body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// เชื่อมต่อ MongoDB
connectDB()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    });

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// ตั้งค่า CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'",
                'https://cdn.jsdelivr.net',
                'https://fonts.googleapis.com',
                "'unsafe-inline'", // อนุญาต inline styles (ถ้าจำเป็น)
            ],
            fontSrc: [
                "'self'",
                'https://fonts.gstatic.com',
                'https://fonts.googleapis.com',
            ],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // อนุญาต inline scripts (ถ้าจำเป็น)
            imgSrc: ["'self'", 'data:', 'https://deployproject-test-task.onrender.com'], // อนุญาตรูปภาพจากแหล่งต่างๆ
        },
    })
);

// ตั้งค่า EJS เป็น template engine
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// กำหนด public folder
app.use(express.static('public'));

// Routes setup
app.use('/', require('./server/routes/authRoutes'));
app.use('/', require('./server/routes/indexRoutes'));
app.use('/', require('./server/routes/spaceRoutes'));

app.get('*', (req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});