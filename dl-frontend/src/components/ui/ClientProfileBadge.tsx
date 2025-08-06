import React from 'react';

interface ClientProfileBadgeProps {
    tipo: 'latoeiro' | 'mecanico' | 'consumidor_final';
    className?: string;
}

const ClientProfileBadge: React.FC<ClientProfileBadgeProps> = ({ tipo, className = '' }) => {
    const getBadgeConfig = (tipo: string) => {
        switch (tipo) {
            case 'latoeiro':
                return {
                    label: 'Latoeiro',
                    bgColor: 'bg-orange-100',
                    textColor: 'text-orange-800',
                    borderColor: 'border-orange-200',
                    icon: '🔧'
                };
            case 'mecanico':
                return {
                    label: 'Mecânico',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-200',
                    icon: '⚙️'
                };
            case 'consumidor_final':
                return {
                    label: 'Consumidor Final',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-200',
                    icon: '👤'
                };
            default:
                return {
                    label: 'Cliente',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-200',
                    icon: '👤'
                };
        }
    };

    const config = getBadgeConfig(tipo);

    return (
        <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            border ${config.bgColor} ${config.textColor} ${config.borderColor}
            transition-all duration-200 hover:scale-105
            ${className}
        `}>
            <span className="text-sm">{config.icon}</span>
            {config.label}
        </span>
    );
};

export default ClientProfileBadge; 