import { Message } from '@/types/domain';

export const generateSmartReply = (messages: Message[]): string | null => {
    if (messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1];

    // Only suggest if the last message is from the contact (not system/user)
    // Assuming 'system' and current user IDs are not the contact.
    // simpler heuristic: if sender is NOT 'system' and we are acting as user.
    // For this prototype, let's just look at content regardless of sender for simplicity,
    // or assume we want to reply to the *last* message in the thread.

    const text = lastMessage.content.toLowerCase();

    if (text.includes('reschedule') || text.includes('change time')) {
        return "I can certainly help you reschedule. What date and time works best for you?";
    }

    if (text.includes('price') || text.includes('cost') || text.includes('quote')) {
        return "I'd be happy to provide a quote. Could you share a few more details about what you're looking for?";
    }

    if (text.includes('available') || text.includes('opening')) {
        return "Yes, we have availability this week. Would you like to see our calendar?";
    }

    if (text.includes('thanks') || text.includes('thank you')) {
        return "You're very welcome! Let me know if you need anything else.";
    }

    if (text.includes('location') || text.includes('where')) {
        return "We are located at 123 CareOps Blvd, Suite 100. We also offer remote consultations.";
    }

    return null;
};
