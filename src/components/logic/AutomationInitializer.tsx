'use client';

import { useEffect, useRef } from 'react';
import { initializeAutomation } from '@/lib/automation';

export default function AutomationInitializer() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initializeAutomation();
            initialized.current = true;
            console.log('Automation Engine Initialized');
        }
    }, []);

    return null;
}
