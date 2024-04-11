const express = require('express');
const router = express.Router();
// สร้าง Router สำหรับ GET ข้อมูลการร้องเรียน
router.get('/complains', (req, res) => {
    connection.query('SELECT * FROM complain', (error, results) => {
      if (error) {
        console.error('Error fetching complains:', error);
        res.status(500).send('Error fetching complains');
        return;
      }
      res.json(results);
    });
  });
  
  // สร้าง Router สำหรับ POST การร้องเรียน
  router.post('/complains', (req, res) => {
    const { studentId, studentName, subject, description } = req.body;
    connection.query('INSERT INTO complain (studentId, studentName, subject, description) VALUES (?, ?, ?, ?)', 
    [studentId, studentName, subject, description], 
    (error, results) => {
      if (error) {
        console.error('Error inserting complain:', error);
        res.status(500).send('Error inserting complain');
        return;
      }
      res.status(201).send('Complain submitted successfully');
    });
  });
  
  // สร้าง Router สำหรับ GET รายการการร้องเรียน
  router.get('/complain_bookings', (req, res) => {
    connection.query('SELECT * FROM complain', (error, results) => {
      if (error) {
        console.error('Error fetching complain bookings:', error);
        res.status(500).send('Error fetching complain bookings');
        return;
      }
      res.json(results);
    });
  });