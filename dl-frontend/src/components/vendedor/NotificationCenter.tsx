import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Clock,
    Info,
    X,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';

interface Notification {
    id: number;
    type: 'success' | 'warning' | 'info' | 'urgent';
    title: string;
    message: string;
    time: string;
    read: boolean;
    action?: string;
    icon?: React.ReactNode;
}

interface NotificationCenterProps {
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onDismiss: (id: number) => void;
}

export default function NotificationCenter({
    notifications,
    onMarkAsRead,
    onDismiss
}: NotificationCenterProps) {
    const [showAll, setShowAll] = useState(false);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'urgent':
                return <Zap className="w-5 h-5 text-red-600" />;
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 hover:bg-green-100';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
            case 'urgent':
                return 'bg-red-50 border-red-200 hover:bg-red-100';
            default:
                return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const displayNotifications = showAll ? notifications : notifications.slice(0, 3);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Notificações</h3>
                        <p className="text-gray-600">
                            {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {displayNotifications.length > 0 ? (
                    displayNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-xl border transition-all duration-200 ${getNotificationColor(notification.type)
                                } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className={`font-semibold text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {notification.time}
                                                </span>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {notification.action && (
                                                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                                    {notification.action}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onDismiss(notification.id)}
                                                className="text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Nenhuma notificação</p>
                        <p className="text-gray-500 text-sm">Você está em dia!</p>
                    </div>
                )}
            </div>

            {notifications.length > 3 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        {showAll ? 'Mostrar menos' : `Ver todas (${notifications.length})`}
                    </button>
                </div>
            )}

            {/* Quick Actions */}
            {unreadCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <button
                            onClick={() => notifications.forEach(n => !n.read && onMarkAsRead(n.id))}
                            className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Marcar todas como lidas
                        </button>
                        <button className="bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                            Configurar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 