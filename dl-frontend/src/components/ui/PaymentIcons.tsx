import React from 'react';

interface PaymentIconProps {
    type: string;
    selected: boolean;
    onClick: () => void;
    label: string;
    description: string;
}

const PaymentIcon: React.FC<PaymentIconProps> = ({ type, selected, onClick, label, description }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'dinheiro':
                return (
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💵</span>
                    </div>
                );
            case 'pix':
                return (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                    </div>
                );
            case 'cartao_debito':
                return (
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                    </div>
                );
            case 'cartao_credito':
                return (
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                    </div>
                );
            case 'transferencia':
                return (
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏦</span>
                    </div>
                );
            case 'fiado':
                return (
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                    </div>
                );
            default:
                return (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                    </div>
                );
        }
    };

    return (
        <button
            onClick={onClick}
            className={`
                p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                ${selected
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
            `}
        >
            <div className="text-center space-y-2">
                {getIcon(type)}
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-500 font-medium">{description}</div>
            </div>
        </button>
    );
};

export default PaymentIcon; 