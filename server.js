require('dotenv').config(); // Load environment variables
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// POST endpoint to handle form submissions
app.post('/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate request body
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Email options
    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_EMAIL, // Your email address
        subject: subject || 'New Contact Form Submission',
        text: `You have a new contact form submission from:
               Name: ${name}
               Email: ${email}
               Message: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'There was an error sending your message. Please try again later.' });
        }
        console.log('Email sent:', info.response);
        res.json({ success: true, message: 'Email sent successfully!' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
