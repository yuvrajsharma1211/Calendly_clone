const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/config/db');
const eventRoutes = require('./src/routes/events');
const availabilityRoutes = require('./src/routes/availability');
const bookingRoutes = require('./src/routes/bookings');
const meetingRoutes = require('./src/routes/meetings');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Register api routes
app.use('/api/events', eventRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/meetings', meetingRoutes);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
