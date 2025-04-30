const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (options) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - Email would have been sent:', {
            to: options.to,
            subject: options.subject,
            hasAttachment: !!options.attachments
        });
        return;
    }

    try {
        const msg = {
            to: options.to,
            from: process.env.FROM_EMAIL || 'itsivali@outlook.com',
            subject: options.subject,
            html: options.html,
            attachments: options.attachments || []
        };

        await sgMail.send(msg);
        console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};

module.exports = sendMail;