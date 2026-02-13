'use client';

import { useState, useMemo, useRef } from 'react';
import { Search, Star, Archive, MoreHorizontal, Paperclip, Send, Phone, Video, Inbox as InboxIcon, X, File, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { useBusinessStore } from '@/lib/store';
import { Attachment } from '@/types/domain';

type FilterType = 'all' | 'starred' | 'archived';

// Internal Helper Component for Smart Replies
import { generateSmartReply } from '@/lib/intelligence';
import { Message } from '@/types/domain';
import { Sparkles } from 'lucide-react';

function SmartReplySuggestion({ messages, onSelect }: { messages: Message[], onSelect: (text: string) => void }) {
    const suggestion = useMemo(() => generateSmartReply(messages), [messages]);

    if (!suggestion) return null;

    return (
        <button
            onClick={() => onSelect(suggestion)}
            className="flex items-center gap-2 mb-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-3 py-2 text-sm hover:bg-indigo-100 hover:border-indigo-200 transition-colors w-full text-left group"
        >
            <Sparkles className="w-4 h-4 flex-none group-hover:animate-pulse" />
            <span className="truncate">{suggestion}</span>
        </button>
    );
}

export default function Inbox() {
    const { leads, messages, sendMessage, currentUser, toggleLeadStar, toggleLeadArchive } = useBusinessStore();
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Derived threads
    const threads = useMemo(() => {
        let filteredLeads = leads;

        // Apply tab filter
        if (filter === 'starred') {
            filteredLeads = filteredLeads.filter(l => l.isStarred && !l.isArchived);
        } else if (filter === 'archived') {
            filteredLeads = filteredLeads.filter(l => l.isArchived);
        } else {
            // Inbox (all non-archived)
            filteredLeads = filteredLeads.filter(l => !l.isArchived);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredLeads = filteredLeads.filter(l =>
                l.name.toLowerCase().includes(query) ||
                l.company?.toLowerCase().includes(query)
            );
        }

        return filteredLeads.map(lead => {
            const leadMessages = messages.filter(m => m.leadId === lead.id);
            const lastMessage = leadMessages.length > 0
                ? leadMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                : null;

            let preview = 'No messages yet';
            if (lastMessage) {
                preview = lastMessage.content;
                if (!preview && lastMessage.attachments && lastMessage.attachments.length > 0) {
                    preview = `📎 ${lastMessage.attachments.length} attachment${lastMessage.attachments.length > 1 ? 's' : ''}`;
                }
            }

            return {
                id: lead.id,
                sender: lead.name,
                subject: lead.company || 'New Lead',
                preview,
                time: lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : new Date(lead.createdAt).toLocaleDateString(),
                unread: false, // Placeholder
                avatar: lead.name.charAt(0),
                color: 'bg-blue-100 text-blue-600',
                lastActivity: lead.lastActivityAt,
                isStarred: lead.isStarred
            };
        }).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    }, [leads, messages, filter, searchQuery]);

    // Active conversation messages
    const activeMessages = useMemo(() => {
        if (!activeThreadId) return [];
        return messages
            .filter(m => m.leadId === activeThreadId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map(m => ({
                id: m.id,
                sender: m.senderId === 'system' ? 'System' : (m.senderId === currentUser?.id ? 'You' : leads.find(l => l.id === activeThreadId)?.name || 'Unknown'),
                content: m.content,
                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: m.senderId === currentUser?.id || m.senderId === 'system',
                isSystem: m.senderId === 'system',
                attachments: m.attachments
            }));
    }, [messages, activeThreadId, leads, currentUser?.id]);

    const activeLead = leads.find(l => l.id === activeThreadId);

    const handleSendMessage = () => {
        if ((!newMessage.trim() && attachments.length === 0) || !activeThreadId || !currentUser) return;
        sendMessage(newMessage, activeThreadId, currentUser.id, attachments);
        setNewMessage('');
        setAttachments([]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newAttachments: Attachment[] = Array.from(e.target.files).map(file => ({
                id: crypto.randomUUID(),
                name: file.name,
                url: URL.createObjectURL(file), // Valid for session
                type: file.type.startsWith('image/') ? 'image' : 'document',
                size: file.size
            }));
            setAttachments(prev => [...prev, ...newAttachments]);
        }
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    const handleCall = () => {
        if (!activeLead) return;
        alert(`Starting audio call with ${activeLead.name}...`);
    };

    const handleVideoCall = () => {
        if (!activeLead) return;
        alert(`Starting video call with ${activeLead.name}...`);
    };

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Thread List */}
            <div className="w-80 flex-none border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 space-y-3">
                    <h2 className="font-semibold text-gray-900">Inbox</h2>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 bg-gray-100/50 p-1 rounded-lg">
                        <button
                            onClick={() => setFilter('all')}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <InboxIcon className="w-3.5 h-3.5" />
                            Inbox
                        </button>
                        <button
                            onClick={() => setFilter('starred')}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === 'starred' ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Star className="w-3.5 h-3.5" />
                            Starred
                        </button>
                        <button
                            onClick={() => setFilter('archived')}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === 'archived' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Archive className="w-3.5 h-3.5" />
                            Archived
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {threads.map((thread) => (
                        <button
                            key={thread.id}
                            onClick={() => setActiveThreadId(thread.id)}
                            className={clsx(
                                'w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 relative',
                                activeThreadId === thread.id && 'bg-indigo-50 hover:bg-indigo-50'
                            )}
                        >
                            {thread.unread && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r" />
                            )}
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium relative", thread.color)}>
                                        {thread.avatar}
                                        {thread.isStarred && (
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={clsx("text-sm font-medium", thread.unread ? "text-gray-900" : "text-gray-700")}>
                                        {thread.sender}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">{thread.time}</span>
                            </div>
                            <div className="pl-10">
                                <div className={clsx("text-sm truncate", thread.unread ? "font-medium text-gray-900" : "text-gray-700")}>
                                    {thread.subject}
                                </div>
                                <div className="text-xs text-gray-500 truncate mt-0.5">
                                    {thread.preview}
                                </div>
                            </div>
                        </button>
                    ))}
                    {threads.length === 0 && (
                        <div className="p-8 text-center text-sm text-gray-500">
                            {filter === 'all' ? 'No conversations found.' : `No ${filter} conversations.`}
                        </div>
                    )}
                </div>
            </div>

            {/* Message View */}
            <div className="flex-1 flex flex-col min-w-0">
                {activeLead ? (
                    <>
                        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 flex-none bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                    {activeLead.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{activeLead.name}</h3>
                                    <p className="text-xs text-gray-500">{activeLead.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <button
                                    onClick={handleCall}
                                    className="p-2 hover:bg-gray-100 rounded-lg hover:text-indigo-600 transition-colors tooltip"
                                    title="Voice Call"
                                >
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleVideoCall}
                                    className="p-2 hover:bg-gray-100 rounded-lg hover:text-indigo-600 transition-colors tooltip"
                                    title="Video Call"
                                >
                                    <Video className="w-4 h-4" />
                                </button>
                                <div className="w-px h-6 bg-gray-200 mx-1" />
                                <button
                                    onClick={() => toggleLeadStar(activeLead.id)}
                                    className={clsx(
                                        "p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip",
                                        activeLead.isStarred ? "text-amber-400 hover:text-amber-500" : "hover:text-amber-400"
                                    )}
                                    title={activeLead.isStarred ? "Unstar" : "Star"}
                                >
                                    <Star className={clsx("w-4 h-4", activeLead.isStarred && "fill-current")} />
                                </button>
                                <button
                                    onClick={() => toggleLeadArchive(activeLead.id)}
                                    className={clsx(
                                        "p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip",
                                        activeLead.isArchived ? "text-gray-900 bg-gray-100" : "hover:text-gray-900"
                                    )}
                                    title={activeLead.isArchived ? "Unarchive" : "Archive"}
                                >
                                    <Archive className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg hover:text-gray-600">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {activeMessages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                activeMessages.map((message) => (
                                    <div key={message.id} className={clsx("flex", message.isMe ? "justify-end" : "justify-start")}>
                                        <div className={clsx(
                                            "max-w-lg rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            message.isSystem
                                                ? "bg-gray-100 text-gray-600 border border-gray-200 mx-auto"
                                                : (message.isMe
                                                    ? "bg-indigo-600 text-white rounded-br-none"
                                                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none")
                                        )}>
                                            {message.isSystem && <span className="text-xs font-bold block mb-1">SYSTEM</span>}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="space-y-2 mb-2">
                                                    {message.attachments.map(att => (
                                                        <div key={att.id} className="relative group">
                                                            {att.type === 'image' ? (
                                                                <img src={att.url} alt={att.name} className="max-w-full rounded-lg max-h-60 object-cover" />
                                                            ) : (
                                                                <div className="flex items-center gap-2 bg-black/5 p-2 rounded-lg">
                                                                    <File className="w-4 h-4 text-gray-500" />
                                                                    <span className="text-xs underline truncate max-w-[150px]">{att.name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {message.content && <p>{message.content}</p>}
                                            <p className={clsx("text-[10px] mt-1 text-right", message.isMe && !message.isSystem ? "text-indigo-200" : "text-gray-400")}>
                                                {message.time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200 flex-none">
                            {/* Smart Reply Suggestion */}
                            {activeLead && (
                                <SmartReplySuggestion
                                    messages={messages.filter(m => m.leadId === activeLead.id)}
                                    onSelect={(suggestion) => setNewMessage(suggestion)}
                                />
                            )}

                            {/* Attachment Preview */}
                            {attachments.length > 0 && (
                                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                    {attachments.map(att => (
                                        <div key={att.id} className="relative flex-none w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
                                            {att.type === 'image' ? (
                                                <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <File className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => removeAttachment(att.id)}
                                                className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-end gap-2 bg-gray-50 rounded-lg border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg tooltip"
                                    title="Attach file"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <textarea
                                    rows={1}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-2 text-sm max-h-32"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() && attachments.length === 0}
                                    className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}
