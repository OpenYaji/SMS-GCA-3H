// server/server.js

import express from 'express';
import mysql from 'mysql2/promise'; 
import cors from 'cors';
import 'dotenv/config'; 

// --- Configuration ---
const PORT = process.env.API_PORT || 5174; 
const REACT_FRONTEND_URL = 'http://localhost:5173'; 

// **IMPORTANT:** Use a realistic employee ID that exists in your guard_profile table
const GUARD_EMPLOYEE_ID = '123456'; 

// Setup Express App
const app = express();

// --- 1. Middleware Setup ---
app.use(cors({
    origin: REACT_FRONTEND_URL 
}));
app.use(express.json());

// --- 2. Database Connection Setup ---
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'aggabaorenz', 
    database: process.env.DB_DATABASE || 'aggabao_db', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- 3. API Endpoint Definitions ---

// GET Student Log
app.get('/api/student-log', async (req, res) => {
    let connection;
    try {
        const sql = `
            SELECT 
                id, 
                user,       
                section             
            FROM user_info
        `;
        
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql);
        
        res.status(200).json(rows);
        
    } catch (error) {
        console.error("Database or API error (student-log):", error.message);
        res.status(500).send(`Internal Server Error. Check database connection and query: ${error.message}`);
        
    } finally {
        if (connection) connection.release();
    }
});


// GET profile by employee_id (For ProfileScreen.jsx)
app.get('/api/profile/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    let connection;
    try {
        const sql = `
            SELECT 
                fname,
                email,
                employee_id,
                sex,
                birthday,
                phone_number,
                address,
                religion,
                mother_tounge,
                nationality,
                weight,
                height,
                avatar
            FROM guard_profile
        `;
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, [employeeId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Database or API error (profile):", error.message);
        // The error response here is crucial for debugging the frontend:
        res.status(500).send(`Internal Server Error. Check database connection and query: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
});


// POST Attendance
app.post('/api/attendance', async (req, res) => {
    const { user, section } = req.body;
    let connection;
    try {
        // NOTE: This assumes 'user' maps to 'id' (student ID) in the user_info table, 
        // which might be confusing based on the variable names.
        const sql = `
            INSERT INTO user_info (id, section) 
            VALUES (?, ?)
        `;
        connection = await pool.getConnection();
        const [result] = await connection.execute(sql, [user, section]);
        res.status(201).json({ message: 'Attendance recorded', id: result.insertId });
    } catch (error) {
        console.error("Database or API error:", error.message);
        res.status(500).send(`Internal Server Error. Check database connection and query: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }       
});


// --- 4. Server Start ---
app.listen(PORT, () => {
    console.log(`\n✅ Backend API running successfully!`);
    console.log(`🌐 Student Log API: http://localhost:${PORT}/api/student-log`);
    console.log(`🌐 Profile API Test: http://localhost:${PORT}/api/profile/${GUARD_EMPLOYEE_ID}`);
    console.log(`➡️ Frontend URL allowed: ${REACT_FRONTEND_URL}`);
    console.log(`\n*** Now run your React app in a separate terminal on port 5173 ***\n`);
});