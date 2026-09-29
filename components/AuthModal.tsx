
import React, { useState } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

// Hardcoded Admin for Demo
const ADMIN_EMAIL = 'admin@medioam.com';
const ADMIN_PASS = 'admin123';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Simulate API call
    setTimeout(() => {
      if (mode === 'forgot') {
        setSuccessMsg('Instructions have been sent to your email.');
        setIsLoading(false);
        return;
      }

      // Admin logic
      if (mode === 'login' && email === ADMIN_EMAIL) {
        if (password === ADMIN_PASS) {
          const adminUser: User = {
            id: 'admin-1',
            name: 'Medioam Admin',
            email: ADMIN_EMAIL,
            phone: '+961 00 000 000',
            joinedAt: new Date('2024-01-01').toISOString(),
          };
          onLogin(adminUser);
          setIsLoading(false);
          onClose();
          return;
        } else {
          setErrorMsg('Invalid admin password.');
          setIsLoading(false);
          return;
        }
      }

      // Mock user logic
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: mode === 'register' ? name : 'John Doe',
        email: email,
        phone: mode === 'register' ? phone : '+961 70 123 456',
        joinedAt: new Date().toISOString(),
      };

      onLogin(mockUser);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-10 pb-12">
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} />
          </div>

          <h2 className="text-2xl font-black text-indigo-950 text-center mb-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join Medioam'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-slate-500 text-center text-sm mb-8">
            {mode === 'login' && 'Enter your credentials to access your account'}
            {mode === 'register' && 'Experience premium comfort with our perks'}
            {mode === 'forgot' && 'Well send you a recovery link to your inbox'}
          </p>

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 px-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 px-1">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="+961 70 000 000" 
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 px-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="name@example.com" 
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</button>
                  )}
                </div>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  placeholder="••••••••" 
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            <p>Admin Login: admin@medioam.com / admin123</p>
          </div>

          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-slate-500">
                Don't have an account? {' '}
                <button onClick={() => setMode('register')} className="text-indigo-600 font-bold hover:underline">Register now</button>
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Already have an account? {' '}
                <button onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline">Sign In</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
