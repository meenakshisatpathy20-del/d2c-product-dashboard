import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';

const DUMMY_ORDERS = [
  { name: 'Priya S.', city: 'Bengaluru', product: 'Minimalist 10% Niacinamide Serum', price: '₹599', time: 'Just now' },
  { name: 'Rahul V.', city: 'Mumbai', product: 'Oversized Cotton French Terry Tee', price: '₹1,299', time: '1m ago' },
  { name: 'Ananya D.', city: 'New Delhi', product: 'Wireless ANC Earbuds Pro', price: '₹2,499', time: '2m ago' },
  { name: 'Karthik M.', city: 'Hyderabad', product: 'Classic Oxford Casual Shirt', price: '₹1,499', time: '3m ago' },
  { name: 'Sneha R.', city: 'Pune', product: 'Vitamin C Glow Face Cream', price: '₹649', time: '4m ago' },
];

export default function LiveSalesNotification() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let orderIndex = 0;

    const interval = setInterval(() => {
      setCurrentOrder(DUMMY_ORDERS[orderIndex]);
      setIsVisible(true);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      orderIndex = (orderIndex + 1) % DUMMY_ORDERS.length;

      return () => clearTimeout(hideTimer);
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  if (!currentOrder || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-3.5 flex items-center gap-3.5 max-w-sm backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
          <ShoppingBag size={18} />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-800">{currentOrder.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">from {currentOrder.city}</span>
            <span className="text-[9px] text-emerald-600 font-extrabold ml-auto">{currentOrder.time}</span>
          </div>
          <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">{currentOrder.product}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-black text-orange-600">{currentOrder.price}</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <CheckCircle2 size={10} /> Verified Purchase
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}