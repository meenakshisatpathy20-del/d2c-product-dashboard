import { useState } from 'react';
import { X, Calculator, Truck, Zap, ShieldCheck } from 'lucide-react';

export default function RateCalculatorModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const [destPincode, setDestPincode] = useState('560001');

  const courierRates = [
    { name: 'Bluedart Air Priority', cost: 120, tat: '1 Day Express', rating: 4.9, badge: 'Fastest SLA' },
    { name: 'Delhivery Surface Direct', cost: 65, tat: '2-3 Days', rating: 4.6, badge: 'Lowest Cost' },
    { name: 'Shadowfax Express Hyper', cost: 80, tat: '1-2 Days', rating: 4.4, badge: 'Metro Special' },
    { name: 'DTDC Premium Track', cost: 75, tat: '2 Days', rating: 4.3, badge: 'Pan-India' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Shiprocket Rate & Courier Matrix</h3>
              <p className="text-[11px] text-slate-500">Live shipping cost & TAT from {product.warehouse}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-500">Product:</span> <strong className="text-slate-900">{product.title}</strong>
          </div>
          <div>
            <span className="text-slate-500">Fulfillment Hub:</span> <strong className="text-blue-700">{product.warehouse}</strong>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Delivery Destination Pincode</label>
          <input
            type="text"
            maxLength={6}
            value={destPincode}
            onChange={(e) => setDestPincode(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:border-blue-600 outline-none"
          />
        </div>

        <div className="space-y-2.5 pt-2">
          <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Available Integrated Couriers</p>
          {courierRates.map((courier, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-400 transition bg-white shadow-2xs">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-blue-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{courier.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {courier.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Est. Transit: {courier.tat}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">₹{courier.cost}</p>
                <p className="text-[10px] text-slate-400">incl. GST & Fuel</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}