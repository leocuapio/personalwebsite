const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
    const { contactName, contactEmail, contactSubject, contactMessage } = JSON.parse(event.body);

    // Configure the email transport using SMTP
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com', // Replace with your SMTP server
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your-email@example.com', // Replace with your email
            pass: 'your-email-password' // Replace with your email password
        }
    });

    // Setup email data
    let mailOptions = {
        from: contactEmail,
        to: 'your-email@example.com', // Replace with your email
        subject: `Contact Form Submission: ${contactSubject}`,
        text: `You have received a new message from ${contactName} (${contactEmail}):\n\n${contactMessage}`
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email' })
        };
    }
};