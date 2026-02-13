'use server';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
    },
});

export async function sendEmail(to: string, subject: string, html: string) {
    if (process.env.NODE_ENV === 'development') {
        console.log('📧 Mock Email:', { to, subject });
        return { success: true };
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@careops.com',
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
