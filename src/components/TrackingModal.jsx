import { X, CheckCircle2, Truck, Package, MapPin, Clock } from 'lucide-react';

export default function TrackingModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const trackingSteps = [
    { title: 'Order Confirmed & Manifested', time: '10:30 AM, Today', completed: true },
    { title: `Picked up from ${product.warehouse}`, time: '01:15 PM, Today', completed: true },
    { title: 'In Transit — Bluedart Express Air Hub', time: 'Expected by 08:00 PM', active: true },
    { title: 'Out for Delivery to Customer', time: 'Tomorrow by 11:00 AM', pending: true }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-in zoom-in duration-150">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Logistics & Tracking</h3>
              <p className="text-[11px] text-slate-400 font-medium">Waybill: AWB-{product.id + 8849102}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-0.5"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{product.title}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">₹{product.priceINR.toLocaleString('en-IN')} • Paid via UPI</p>
          </div>
        </div>

        <div className="space-y-4 relative pl-2">
          {trackingSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 relative">
              {idx < trackingSteps.length - 1 && (
                <div className={`absolute left-2.5 top-5 w-0.5 h-7 ${step.completed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
              <div className="z-10 mt-0.5">
                {step.completed ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={13} />
                  </div>
                ) : step.active ? (
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center animate-pulse">
                    <Clock size={12} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Close Tracking Drawer
        </button>
      </div>
    </div>
  );
}