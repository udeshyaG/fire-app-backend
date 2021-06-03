const express = require('express');
const cookieSession = require('cookie-session');
const authRoutes = require('./src/routes/auth');
const checklistRoutes = require('./src/routes/checklist');
const equipmentRoutes = require('./src/routes/equipment');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');
const addPhoto = require('./src/routes/add-photo');
const checkAdminLogin = require('./src/middlewares/check-admin-login');

const app = express();

app.use(express.json());

app.set('trust proxy', true);
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1'],
  })
);

app.use(authRoutes);
app.use(checklistRoutes);
app.use(equipmentRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(addPhoto);

app.get('/', checkAdminLogin, (req, res) => {
  res.send('Hello');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port 3000'));
