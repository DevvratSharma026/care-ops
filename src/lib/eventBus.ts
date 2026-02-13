import { AutomationEventType } from '@/types/domain';

type EventHandler = (payload: unknown) => void;

class EventBus {
    private handlers: Map<AutomationEventType, EventHandler[]>;

    constructor() {
        this.handlers = new Map();
    }

    subscribe(eventType: AutomationEventType, handler: EventHandler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType)?.push(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.handlers.get(eventType);
            if (handlers) {
                this.handlers.set(eventType, handlers.filter(h => h !== handler));
            }
        };
    }

    dispatch(eventType: AutomationEventType, payload: unknown) {
        const handlers = this.handlers.get(eventType);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(payload);
                } catch (error) {
                    console.error(`Error handling event ${eventType}:`, error);
                }
            });
        }
    }
}

export const eventBus = new EventBus();
