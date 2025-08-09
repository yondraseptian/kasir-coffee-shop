import { formatRupiah } from '@/lib/utils';
import { ReceiptProps } from '@/types';
import React, { useEffect } from 'react';

export const Receipt: React.FC<ReceiptProps> = ({ transaction }) => {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="receipt-print mx-auto max-w-sm bg-white p-4 font-mono text-sm shadow-lg print:mx-0 print:max-w-none print:p-0 print:shadow-none">
            <div className="mb-2 text-center text-lg font-bold">RECEIPT</div>
            <div className="mb-4 text-center text-base">yoji coffee</div>

            <hr className="my-2 border-dashed border-gray-400" />

            <div className="mb-2 flex flex-col gap-1">
                <div>
                    <span className="font-semibold">Bill Num &ensp;&ensp;:</span> {transaction.billNum}
                </div>
                <div>
                    <span className="font-semibold">Queue Num&emsp;&ensp;:</span> {transaction.queueNum}
                </div>
                <div>
                    <span className="font-semibold">Sales Mode&ensp;:</span> {transaction.salesMode}
                </div>
                <div>
                    <span className="font-semibold">Date&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;:</span>{' '}
                    {new Date(transaction.createdAt).toLocaleString('id-ID')}
                </div>
                <div className="col-span-2">
                    <span className="font-semibold">Customer&ensp;&ensp;&ensp;:</span> {transaction.member || '-'}
                </div>
                <div className="col-span-2">
                    <span className="font-semibold">Cashier&ensp;&ensp;&ensp;&ensp;:</span> {transaction.cashier}
                </div>
            </div>

            <hr className="my-2 border-dashed border-gray-400" />

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
                            <div className="text-right font-semibold">{formatRupiah(item.subtotal)}</div>
                        </div>
                    </div>
                ))}
            </div>

            <hr className="my-2 border-dashed border-gray-400" />

            <div className="mt-4 flex justify-between text-lg font-bold">
                <div>Total</div>
                <div>{formatRupiah(transaction.total)}</div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-700">Thank you for your purchase!</div>
        </div>
    );
};

