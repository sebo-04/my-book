const express = require('express'); 
const cors = require('cors'); 
const path = require('path');
const app = express();
const port = 3030;

const authRoutes = require('./backend/routes/auth');
const bookRoutes = require('./backend/routes/books');
const libraryRoutes = require('./backend/routes/library');
const profileRoutes = require('./backend/routes/profile');
const bookDetailsRoutes = require('./backend/routes/Bookdetails');
const userRoutes = require('./backend/routes/users');
const sidebarRoutes = require('./backend/routes/sidebar');
const dashboardRoutes = require('./backend/routes/dashboard');
const readRoutes = require('./backend/routes/read');

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تفعيل مجلد الرفع الاستاتيكي للملفات الحقيقية
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// إعداد المسارات والروابط البرمجية (API Routes)
app.use('/api/library', libraryRoutes);
app.use('/api', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', profileRoutes);
app.use('/api/Detabooks', bookDetailsRoutes);
app.use('/api/dashboard', userRoutes);
app.use('/api/sidebar', sidebarRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/read', readRoutes);

app.get('/', (req, res) => {
  res.send('Welcome! The my-book project server is running successfully on port 3030. 🚀');
});

app.listen(port, () => {
  console.log(`Server is now running on: http://localhost:${port}`);
});