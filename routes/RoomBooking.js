const express = require('express')
const router = express.Router();
const pool = require('./../db')

router.get('/vacentRoom' , async(req , res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.query('SELECT * FROM room WHERE status = $1', ['Available']);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching vacant rooms:', error);
        res.status(500).json({ error: 'Failed to fetch vacant rooms' });
    }
});

router.post('/bookRoom', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('INSERT INTO room_booking (student_id, room_id, duration) VALUES (?, ?, ?)'
        , [student_id, room_id, duration]);
        res.status(200).json({ message: 'Booking room success' });
    } catch (error) {
        console.error('Error inserting booking:', error);
        res.status(500).json({ error: 'Failed to book room' });
    }
});

router.get('/roomBooking', async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM room_booking');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching room bookings:', error);
        res.status(500).json({ error: 'Failed to fetch room bookings' });
    }
});

router.delete('/cancelRoomBooking/:RBooking_id', async(req, res) => {
    const RBooking_id = req.params.RBooking_id;
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM room_booking WHERE RBooking_id = ?', [RBooking_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        await pool.execute('DELETE FROM room_booking WHERE  RBooking_id = ?', [RBooking_id]);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});