const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: String
}, { timestamps: true });

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    amenities: [String],
    pricePerNight: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    checkInDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    status: { type: Number, enum: [0, 1, 2], default: 0 }, // 0: CONFIRMED, 1: CANCELLED, 2: COMPLETED
    specialRequests: String
}, { timestamps: true });

module.exports = {
    User: mongoose.model('User', UserSchema),
    Hotel: mongoose.model('Hotel', HotelSchema),
    Booking: mongoose.model('Booking', BookingSchema)
};
