
import React, { useState } from 'react';
import { AdminSettings } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState<AdminSettings>(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#4A3B18]">SMTP & Notifications</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure automated workflows</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SMTP Host</label>
              <input 
                required
                type="text" 
                value={formData.smtpHost}
                onChange={e => setFormData({...formData, smtpHost: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none text-sm"
                placeholder="smtp.example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SMTP Port</label>
                <input 
                  required
                  type="text" 
                  value={formData.smtpPort}
                  onChange={e => setFormData({...formData, smtpPort: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none text-sm"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SMTP User</label>
                <input 
                  required
                  type="email" 
                  value={formData.smtpUser}
                  onChange={e => setFormData({...formData, smtpUser: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none text-sm"
                  placeholder="notifications@medioam.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SMTP Password</label>
              <input 
                required
                type="password" 
                value={formData.smtpPass}
                onChange={e => setFormData({...formData, smtpPass: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none text-sm"
                placeholder="********"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notification Recipient</label>
              <input 
                required
                type="email" 
                value={formData.notificationEmail}
                onChange={e => setFormData({...formData, notificationEmail: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none text-sm"
                placeholder="admin@medioam.com"
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">This email will receive alerts whenever a new website order is placed.</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#B89548] hover:bg-[#967936] text-white font-black py-4 rounded-xl shadow-lg transition-all"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
