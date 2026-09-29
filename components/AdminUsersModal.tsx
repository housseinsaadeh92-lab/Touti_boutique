
import React, { useMemo } from 'react';
import { User, Order } from '../types';

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  orders: Order[];
}

const AdminUsersModal: React.FC<AdminUsersModalProps> = ({ isOpen, onClose, users, orders }) => {
  if (!isOpen) return null;

  const userStats = useMemo(() => {
    return users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        ...user,
        orderCount: userOrders.length,
        totalSpent
      };
    }).sort((a, b) => {
      // Sort by joinedAt descending (newest first)
      const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
      const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [users, orders]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-indigo-950">User Management</h2>
            <p className="text-slate-500 text-sm">Review all registered users and their activity</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-1">Total Users</p>
              <p className="text-3xl font-black text-indigo-950">{users.length}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-1">Active Customers</p>
              <p className="text-3xl font-black text-emerald-950">{users.filter(u => orders.some(o => o.userId === u.id)).length}</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <p className="text-amber-600 text-xs font-black uppercase tracking-widest mb-1">New Signups (Today)</p>
              <p className="text-3xl font-black text-amber-950">
                {users.filter(u => u.joinedAt && new Date(u.joinedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">User Info</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Contact & Address</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Orders</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userStats.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{user.phone}</p>
                      <p className="text-xs text-slate-400 max-w-[200px] truncate" title={user.address}>
                        {user.address || 'No address set'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {user.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-black text-slate-900">${user.totalSpent.toLocaleString()}</p>
                    </td>
                  </tr>
                ))}
                {userStats.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      No users registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersModal;
