
import React, { useState } from 'react';
import { Order } from '../types';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose, orders, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'All' | Order['source']>('All');

  if (!isOpen) return null;

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.source === filter);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-black text-[#4A3B18]">Order Control Center</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Reviewing all business activity</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex gap-4">
          <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'All' ? 'bg-[#B89548] text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>All Orders</button>
          <button onClick={() => setFilter('website')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'website' ? 'bg-[#B89548] text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>Website Only</button>
          <button onClick={() => setFilter('whatsapp')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'whatsapp' ? 'bg-[#B89548] text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>WhatsApp Only</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">No orders found matching this filter.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="text-xs font-black text-slate-900 mb-1">#{order.id.toUpperCase()}</div>
                      <div className="text-[10px] font-bold text-slate-400">{order.date}</div>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${order.source === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>{order.source}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-xs font-bold text-slate-800">{order.userName}</div>
                      <div className="text-[10px] text-slate-500">{order.userPhone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.address || 'No address provided'}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-[10px] text-slate-600 space-y-0.5">
                        {order.items.map((it, i) => (
                          <div key={i}>{it.quantity}x {it.name}</div>
                        ))}
                      </div>
                      <div className="text-xs font-black text-[#B89548] mt-2">${order.total}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Approved' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                        className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#B89548]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersModal;
