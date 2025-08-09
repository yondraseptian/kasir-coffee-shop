import { useEffect } from 'react';
import { CupLabel, Receipt } from '@/components/Receipt';

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
      {/* <div className="print:break-before-page" />
      <div className="grid grid-cols-2 gap-4 print:grid-cols-1">
        {transaction.items.map((item, i) => (
        //   <CupLabel
        //     key={i}
        //     queue={transaction.queueNum || '-'}
        //     customerName={transaction.member}
        //     salesMode={transaction.salesMode}
        //     productName={item.name}
        //     variant={[item.size, item.temperature].filter(Boolean).join(' / ')}
        //   />
        ))}
      </div> */}
    </div>
  );
}


