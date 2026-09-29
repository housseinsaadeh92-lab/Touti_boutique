
import React from 'react';
import { User } from '../types';
import Logo from './Logo';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  currentUser: User | null;
  onAuthClick: () => void;
  onProfileClick: () => void;
  onOrdersClick: () => void;
  onAdminOrdersClick: () => void;
  onAdminUsersClick: () => void;
  onAdminSettingsClick: () => void;
  onAdminInventoryClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onCartClick, 
  currentUser, 
  onAuthClick,
  onProfileClick,
  onOrdersClick,
  onAdminOrdersClick,
  onAdminUsersClick,
  onAdminSettingsClick,
  onAdminInventoryClick,
  onLogout 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const isAdmin = currentUser?.email === 'admin@toutiboutique.com' || currentUser?.email === 'admin@medioam.com';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <Logo />
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="relative">
            {currentUser ? (
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-[#B89548]/10 rounded-full flex items-center justify-center text-[#B89548] font-bold uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm font-bold text-slate-700">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button 
                onClick={onAuthClick}
                className="text-sm font-black text-[#B89548] hover:text-[#967936] px-5 py-2 border border-[#B89548]/20 rounded-2xl hover:bg-[#B89548]/5 transition-all"
              >
                Login
              </button>
            )}

            {showMenu && currentUser && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-xs text-slate-400 font-medium truncate">{currentUser.email}</p>
                    {isAdmin && <span className="text-[10px] font-black uppercase text-[#B89548] tracking-widest mt-1 inline-block">Administrator</span>}
                  </div>
                  
                  <button onClick={() => { onProfileClick(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </button>
                  
                  <button onClick={() => { onOrdersClick(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 118 0m-4 7v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                    My Orders
                  </button>

                  {isAdmin && (
                    <div className="bg-slate-50/50 border-t border-b border-slate-100 py-1">
                      <button onClick={() => { onAdminOrdersClick(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-[#4A3B18] font-bold hover:bg-slate-100 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Manage Orders
                      </button>
                      <button onClick={() => { onAdminInventoryClick(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-[#4A3B18] font-bold hover:bg-slate-100 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        Manage Inventory
                      </button>
                      <button onClick={() => { onAdminUsersClick(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-[#4A3B18] font-bold hover:bg-slate-100 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Manage Users
                      </button>
                      <button onClick={() => { onAdminSettingsClick(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-[#4A3B18] font-bold hover:bg-slate-100 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        SMTP Settings
                      </button>
                    </div>
                  )}

                  <button onClick={() => { onLogout(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <button onClick={onCartClick} className="relative p-2 text-slate-600 hover:text-[#B89548] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
