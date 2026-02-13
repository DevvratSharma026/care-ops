

import 'dotenv/config'; // Load env vars
import { useBusinessStore } from '../src/lib/store';
import { initializeAutomation } from '../src/lib/automation';
import { eventBus } from '../src/lib/eventBus';

console.log('--- STARTING EMAIL VERIFICATION (SMTP) ---');
const hasSmtp = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
console.log('SMTP Configured:', hasSmtp);

if (hasSmtp) {
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP User:', process.env.SMTP_USER);
} else {
    console.warn('⚠️ WARNING: Missing SMTP credentials. Emails will be simulated.');
}

// 1. Initialize Automation
initializeAutomation();
const store = useBusinessStore.getState();

// 2. Trigger Lead Creation (should send Welcome Email)
console.log('\n[Step 1] Creating Lead...');
useBusinessStore.getState().addLead({
    id: 'test-lead-email',
    name: 'Email Tester',
    email: 'test@email.com',
    phone: '1234567890',
    status: 'new',
    source: 'Email Verification Script'
});

// 3. Trigger Staff Addition (should send Invite Email)
console.log('\n[Step 2] Adding Staff...');
// Need a user with MANAGE_STAFF permission. Default admin has it.
useBusinessStore.getState().addStaff({
    name: 'New Staff Member',
    email: 'staff@email.com',
    role: 'staff',
    avatarUrl: ''
});

// 4. Trigger Message Sent (should send Admin Notification)
console.log('\n[Step 3] Sending Message...');
eventBus.dispatch('MESSAGE_SENT', {
    content: 'This is a test message that should trigger an email to admin.',
    senderId: 'test-lead-email'
});

console.log('\n--- VERIFICATION COMPLETE (Check logs above for [Server Action] outputs) ---');
