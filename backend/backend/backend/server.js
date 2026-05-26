const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { User, Hotel, Booking } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_booking_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// 1. GET /api/hotels/getHotelList
app.get('/api/hotels/getHotelList', async (req, res) => {
    let { page = 1, limit = 10, search = '', state = '', city = '', rating = '', status = '' } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (state) query.state = state;
    if (city) query.city = city;
    if (rating) query.rating = Number(rating);
    if (status) query.isActive = (status === 'Active');

    const hotels = await Hotel.find(query).limit(limit * 1).skip((page - 1) * limit).sort({ name: 1 });
    res.json({ hotels, totalRecords: await Hotel.countDocuments(query) });
});

// 2. GET /api/users/getUserList
app.get('/api/users/getUserList', async (req, res) => {
    let { page = 1, limit = 10, search = '' } = req.query;
    let query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];
    }
    const users = await User.find(query).limit(limit * 1).skip((page - 1) * limit).sort({ name: 1 });
    res.json({ users, totalRecords: await User.countDocuments(query) });
});

// 3. GET /api/bookings/getBookings
app.get('/api/bookings/getBookings', async (req, res) => {
    let { page = 1, limit = 10, userId, hotelId, status, startDate, endDate, download } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    if (hotelId) query.hotelId = hotelId;
    if (status !== undefined && status !== '') query.status = Number(status);
    if (startDate && endDate) query.checkInDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    if (download === 'true') {
        const downloadData = await Booking.find(query).populate('userId').populate('hotelId');
        return res.json({ downloadData });
    }

    const bookings = await Booking.find(query).populate('userId').populate('hotelId').limit(limit * 1).skip((page - 1) * limit).sort({ checkInDate: 1 });
    res.json({ bookings, totalRecords: await Booking.countDocuments(query) });
});

// 4. POST /api/bookings/createBooking
app.post('/api/bookings/createBooking', async (req, res) => {
    try {
        const { userId, hotelId, checkinDate, guestCount, requirements } = req.body;
        const requestedCheckIn = new Date(checkinDate);
        const today = new Date();

        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        if (requestedCheckIn.toDateString() === tomorrow.toDateString() && today.getHours() >= 21) {
            return res.status(400).json({ message: "Bookings for tomorrow are blocked after 9 PM." });
        }

        const duplicate = await Booking.findOne({
            userId, hotelId, status: 0,
            checkInDate: {
                $gte: new Date(requestedCheckIn.setHours(0,0,0,0)),
                $lte: new Date(requestedCheckIn.setHours(23,59,59,999))
            }
        });
        if (duplicate) return res.status(400).json({ message: "Duplicate booking for this hotel today." });

        const booking = new Booking({ userId, hotelId, checkInDate: checkinDate, numberOfGuests: guestCount, specialRequests: requirements, status: 0 });
        await booking.save();
        res.status(201).json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. POST /api/bookings/:bookingId/cancel
app.post('/api/bookings/:bookingId/cancel', async (req, res) => {
    await Booking.findByIdAndUpdate(req.params.bookingId, { status: 1 });
    res.json({ success: true, message: "Booking cancelled." });
});

// 6 & 7. State & City endpoints
app.get('/api/state', async (req, res) => res.json(['Delhi', 'Maharashtra', 'Karnataka']));
app.get('/api/city', async (req, res) => res.json(['New Delhi', 'Mumbai', 'Bengaluru']));

app.listen(process.env.PORT || 5000, () => console.log('Backend Online'));

