'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto transition-all transform translate-y-0 opacity-100 min-w-[300px]",
                            toast.type === 'success' && "bg-white border-green-200 text-green-800",
                            toast.type === 'info' && "bg-white border-blue-200 text-blue-800",
                            toast.type === 'warning' && "bg-white border-yellow-200 text-yellow-800",
                            toast.type === 'error' && "bg-white border-red-200 text-red-800"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}

                        <p className="flex-1 text-sm font-medium">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
