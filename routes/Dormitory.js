const Router  = require("express");
const router = express.Router();
const pool = require('./../db')
connection = pool.getConnection();

router.get('/vacantRoom', async (req, res) => {
    try {
      const vacantRooms = await pool.query('SELECT * FROM dorm_room WHERE status = $1', ['vacant']);
      res.json(vacantRooms.rows);
    } catch (error) {
      console.error('Error fetching vacant rooms:', error);
      res.status(500).send('Error fetching vacant rooms');
    }
});

router.post('/bookRoom', async (req, res) => {
    try {
        const { student_id, room_id, duration } = req.body; 
        await pool.execute('INSERT INTO RoomBooking (student_id, room_id, duration) VALUES (?, ?, ?)'
        , [student_id, room_id, duration]);
        res.status(200).json({ message: 'Booking room success' });
    } catch (error) {
        console.error('Error booking room:', error);
        res.status(500).send('Error booking room');
    }
  });

router.delete('/cancelDormBooking/:booking_id', async (req, res) => {
    try {
        const bookingId = req.params.booking_id; 
        await pool.execute('DELETE FROM RoomBooking WHERE booking_id = ?', [bookingId]);
        res.status(200).json({ message: 'Room booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling room booking:', error);
        res.status(500).send('Error canceling room booking');
    }
});

router.post('/selectDormService', async (req, res) => {
    try {
        const { title, details, room_id, service_type } = req.body; 
        const result = await pool.query('INSERT INTO dorm_service (title, details, room_id, service_type) VALUES ($1, $2, $3, $4) RETURNING *'
        , [title, details, room_id, service_type]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error assigning dormitory service:', error);
        res.status(500).send('Error assigning dormitory service');
    }
});
router.delete('/cancelDormService/:service_id', async (req, res) => {
    try {
        const serviceId = req.params.service_id;
        await pool.execute('DELETE FROM dorm_service WHERE service_id = ?', [serviceId]);
        res.status(200).json({ message: 'Dormitory service deleted successfully' });
    } catch (error) {
        console.error('Error deleting dormitory service:', error);
        res.status(500).send('Error deleting dormitory service');
    }
});



