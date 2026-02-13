
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import nodemailer from 'nodemailer';

console.log('--- SMTP SIMPLE TEST ---');

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ ERROR: SMTP credentials missing from environment.');
    console.error('Required: SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT (optional)');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function test() {
    try {
        console.log('Attempting to send email...');
        console.log('Host:', process.env.SMTP_HOST);
        console.log('User:', process.env.SMTP_USER);

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Test" <noreply@careops.com>', // sender address
            to: process.env.SMTP_USER, // Send to self for testing
            subject: 'Test Email from SMTP Script',
            html: '<p>This is a test email via Nodemailer.</p>'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (e) {
        console.error('❌ SMTP Error:', e);
    }
}

test();
