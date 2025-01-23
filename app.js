const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// เชื่อมต่อ MongoDB (แทนที่ <YOUR_MONGODB_URI> ด้วย URI จริง)
mongoose.connect('mongodb+srv://admin:1234@cluster0.uku92.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// สร้าง Schema
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

// สร้าง Model
const Item = mongoose.model('Item', itemSchema);

// ตั้งค่า EJS เป็น template engine
app.set('view engine', 'ejs');

// กำหนด public folder
app.use(express.static('public'));

// Route สำหรับหน้าแรก
app.get('/', async (req, res) => {
  try {
    const items = await Item.find({});
    res.render('index', { items: items });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving items');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});