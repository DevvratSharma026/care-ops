
// @ts-nocheck
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Resend } from 'resend';

// Replicating logic without aliases
console.log('--- RESEND SIMPLE TEST ---');

if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY is missing from environment.');
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

// We need a valid 'to' email if on free tier
// We'll try to find it from the key prefix or just use a dummy one and see the error.
// Wait, Resend free tier only allows sending to the *owner's* email. 
// We will test sending to a placeholder and see what the API says.
// If the user's key is valid, we should get a specific error about verifying the domain/sender if we send to a random address.

// BUT, if we can read the .env file, we might see if they put their email somewhere or just try sending to 'onboarding@resend.dev' which is allowed?
// Actually, sending FROM 'onboarding@resend.dev' is allowed to the verified email.
// Sending TO a random email on free tier fails.

const testEmail = 'delivered@resend.dev'; // Resend provides this test address that always succeeds? 
// Actually no, delivered@resend.dev is for webhooks testing sometimes.
// Let's just try sending to 'test@example.com'. If key is valid but account is free, it will error with "validation_error" saying "You can only send to your own email address". This CONFIRMS the key is valid.
// If key is invalid, it will say "re_api_key_invalid".

async function test() {
    try {
        console.log('Attempting to send email...');
        const data = await resend.emails.send({
            from: 'CareOps <onboarding@resend.dev>',
            to: ['test@example.com'], // This will fail on free tier if not the owner's email
            subject: 'Test Email from Script',
            html: '<p>This is a test.</p>'
        });

        if (data.error) {
            console.error('❌ API Error:', data.error);
        } else {
            console.log('✅ API Success:', data);
        }
    } catch (e) {
        console.error('❌ Exception:', e);
    }
}

test();
