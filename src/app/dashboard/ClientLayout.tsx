'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            <OnboardingWizard />
            {children}
        </DashboardLayout>
    );
}
