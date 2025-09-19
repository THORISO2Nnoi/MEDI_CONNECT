require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/patient', patientRoutes);
app.use('/api', doctorRoutes); // doctor endpoints

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
