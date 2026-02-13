import { UserRole, LeadStatus, BookingStatus } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Default Settings
    const settings = await prisma.settings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            businessName: 'CareOps Demo',
            contactEmail: 'contact@careops.demo',
            currency: 'USD',
            availability: {
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                start: '09:00',
                end: '17:00'
            },
            integrations: {
                emailProvider: true,
                smsProvider: false,
                calendar: false
            }
        }
    });
    console.log('✅ Settings created');

    // 2. Create Services
    const service1 = await prisma.service.create({
        data: {
            name: 'Standard Consultation',
            description: 'A basic check-up and consultation.',
            duration: 60,
            price: 150.00
        }
    });

    const service2 = await prisma.service.create({
        data: {
            name: 'Premium Care Package',
            description: 'Full comprehensive care package.',
            duration: 90,
            price: 299.00
        }
    });
    console.log('✅ Services created');

    // 3. Create Users
    const owner = await prisma.user.create({
        data: {
            name: 'Demo Owner',
            email: 'owner@careops.demo',
            role: UserRole.OWNER,
            avatarUrl: 'https://i.pravatar.cc/150?u=owner'
        }
    });

    const staff = await prisma.user.create({
        data: {
            name: 'Sarah Staff',
            email: 'sarah@careops.demo',
            role: UserRole.STAFF,
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
        }
    });
    console.log('✅ Users created');

    // 4. Create Leads
    const lead1 = await prisma.lead.create({
        data: {
            name: 'Alice Anderson',
            email: 'alice@example.com',
            phone: '555-0101',
            status: LeadStatus.NEW,
            source: 'Website',
            notes: 'Interested in premium package'
        }
    });

    const lead2 = await prisma.lead.create({
        data: {
            name: 'Bob Brown',
            email: 'bob@example.com',
            status: LeadStatus.CONTACTED,
            source: 'Referral'
        }
    });
    console.log('✅ Leads created');

    // 5. Create Bookings
    await prisma.booking.create({
        data: {
            date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
            time: '10:00',
            duration: 60,
            status: BookingStatus.PENDING,
            leadId: lead1.id,
            serviceId: service1.id,
            staffId: staff.id
        }
    });
    console.log('✅ Bookings created');

    console.log('🌱 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
