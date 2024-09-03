require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');

const app = express();
app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/protected', protectedRoutes);

const port = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected...');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => console.log('Error: ' + err));
