'use server';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail(to: string, subject: string, html: string) {
    console.log(`[Server Action] Attempting to send email to ${to}`);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP Credentials missing. Email simulation:', { to, subject });
        return { success: false, error: 'Missing SMTP Credentials', simulated: true };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"CareOps" <noreply@careops.com>', // sender address
            to,
            subject,
            html,
        });

        console.log('[Server Action] Email sent successfully:', info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error('[Server Action] Failed to send email:', error);
        return { success: false, error };
    }
}
