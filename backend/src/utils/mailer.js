const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail({ to, subject, html, attachments = [] }) {
    try {
        const msg = {
            to,
            from: process.env.FROM_EMAIL || 'itsivali@outlook.com',
            subject,
            html,
            attachments
        };

        await sgMail.send(msg);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
}

module.exports = sendMail;