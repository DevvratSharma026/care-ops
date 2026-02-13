
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { useBusinessStore } from '../src/lib/store';
import { sendEmail } from '../src/app/actions';

console.log('--- VERIFYING INVOICE EMAIL ---');

const testLead = {
    name: 'Invoice Tester',
    email: process.env.SMTP_USER || 'test@example.com', // Send to self
    amount: '150.00'
};

async function testInvoiceEmail() {
    if (!process.env.SMTP_HOST) {
        console.warn('Skipping test: No SMTP configuration found.');
        return;
    }

    console.log(`Sending invoice ($${testLead.amount}) to ${testLead.name} <${testLead.email}>...`);

    const result = await sendEmail(
        testLead.email,
        `Invoice from CareOps`,
        `<p>Hi ${testLead.name},</p><p>Please find attached your invoice for $${testLead.amount}.</p>`
    );

    if (result.success) {
        console.log('✅ Invoice email sent successfully!');
    } else {
        console.error('❌ Failed to send invoice email:', result.error);
    }
}

testInvoiceEmail();
