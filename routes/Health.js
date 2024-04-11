const express = require('express');
const router = express.Router();

// สร้าง Router สำหรับ GET ข้อมูลการนัดหมาย
router.get('/appointments', (req, res) => {
    connection.query('SELECT * FROM appointments', (error, results) => {
      if (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments');
        return;
      }
      res.json(results);
    });
  });
  
   // สร้าง Router สำหรับ POST การนัดหมาย
router.post('/appointments', (req, res) => {
    const { studentId, studentName, appointmentDate, subject } = req.body;
    connection.query('INSERT INTO appointments (studentId, studentName, appointmentDate, subject, status) VALUES (?, ?, ?, ?, ?)', 
    [studentId, studentName, appointmentDate, subject, status], 
    (error, results) => {
      if (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Error booking appointment');
        return;
      }
      res.status(201).send('Appointment booked successfully');
    });
  });
  
  // สร้าง Router สำหรับ PUT อัปเดตสถานะการนัดหมาย
  router.put('/appointments/:studentId', (req, res) => {
    const { studentId } = req.params;
    const { status } = req.body;
    connection.query('UPDATE appointments SET status = ? WHERE studentId = ?', [status, studentId], (error, results) => {
      if (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).send('Error updating appointment status');
        return;
      }
      res.send('Appointment status updated successfully');
    });
  });
  

  // สร้าง Router สำหรับ GET รายการการนัดหมาย
  router.get('/appointment_bookings', (req, res) => {
    connection.query('SELECT studentId, studentName, appointmentDate, subject, status FROM appointments', (error, results) => {
      if (error) {
        console.error('Error fetching appointment bookings:', error);
        res.status(500).send('Error fetching appointment bookings');
        return;
      }
      res.json(results);
    });
  });
  