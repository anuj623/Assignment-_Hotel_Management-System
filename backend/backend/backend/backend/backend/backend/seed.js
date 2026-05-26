const mongoose = require('mongoose');
const { User, Hotel } = require('./models');

mongoose.connect('mongodb://localhost:27017/hotel_booking_db').then(async () => {
    await User.deleteMany({}); await Hotel.deleteMany({});
    await User.create({ name: "Amit Sharma", email: "amit@test.com", phone: "9876543210" });
    await Hotel.create({ name: "Taj Mahal Palace", location: "Colaba", city: "Mumbai", state: "Maharashtra", country: "India", rating: 5, pricePerNight: 12000, isActive: true });
    console.log("Database Seeded!"); process.exit();
});
