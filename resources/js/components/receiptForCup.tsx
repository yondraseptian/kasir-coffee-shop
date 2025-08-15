import { ReceiptProps } from '@/types';
import React, { useEffect } from 'react';

export const ReceiptForCup: React.FC<ReceiptProps> = ({ transaction }) => {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="receipt-print mx-auto max-w-sm bg-white p-4 font-mono text-sm shadow-lg print:mx-0 print:max-w-none print:p-0 print:shadow-none">
            <div className="mb-2">
                {transaction.items?.map((item, i) => (
                    <div key={i} className="mb-2">
                        <div className="flex items-start justify-between">
                            <div className="flex">
                                <div>
                                    {item.quantity}x {item.name}
                                    {item.variant && <div className="ml-2 text-xs text-gray-600">Varian: {item.variant}</div>}

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
                <span>{new Date(transaction.createdAt).toLocaleString('id-ID')}</span>

            <div className="mt-6 text-center text-xs text-gray-700">Thank you for your purchase!</div>
        </div>
    );
};
