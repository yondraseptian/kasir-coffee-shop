import { useEffect } from 'react';
import { ReceiptForCup } from '@/components/receiptForCup';
import { Receipt } from '@/components/receipt';

interface TransactionItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  size?: string;
  temperature?: string;
}

interface Transaction {
  billNum: string;
  queueNum?: string;
  cashier: string;
  member: string;
  salesMode: string;
  createdAt: string;
  items: TransactionItem[];
  total: number;
}

export default function ReceiptPage({ transaction }: { transaction: Transaction }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 space-y-8 print:space-y-4">
      {/* Struk utama */}
      <Receipt transaction={transaction} />

      {/* Cup Labels */}
      <ReceiptForCup transaction={transaction} />
    </div>
  );
}


