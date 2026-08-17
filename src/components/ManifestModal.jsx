import { X, Printer, CheckCircle2, QrCode, FileText } from 'lucide-react';

export default function ManifestModal({ isOpen, onClose, selectedProducts, onDownload }) {
  if (!isOpen || selectedProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 animate-in zoom-in duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Courier Pickup Manifest</h3>
              <p className="text-[11px] text-slate-500">Official handover document for Shiprocket courier pickup executives</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-slate-900">Manifest ID: <span className="font-mono text-blue-600">MNF-{Date.now().toString().slice(-6)}</span></p>
            <p className="text-slate-500 mt-0.5">Total Parcels for Dispatch: <strong>{selectedProducts.length}</strong></p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
            <QrCode size={18} /> SCAN HANDOVER
          </div>
        </div>

        <div className="max-h-52 overflow-y-auto space-y-2 divide-y divide-slate-100">
          {selectedProducts.map((p) => (
            <div key={p.id} className="pt-2 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-900">{p.title}</p>
                <p className="text-[11px] text-slate-400">AWB-{p.id + 893041} • {p.preferredCourier || 'Bluedart'}</p>
              </div>
              <span className="font-bold text-slate-800">₹{p.priceINR.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onDownload();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Printer size={14} /> Print & Download Manifest
          </button>
        </div>
      </div>
    </div>
  );
}