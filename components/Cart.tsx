
import React, { useState, useEffect } from 'react';
import { CartItem, City, User, Order } from '../types';
import { CITIES_LEBANON, WHATSAPP_NUMBER } from '../constants';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number, size?: string) => void;
  onRemove: (id: string, size?: string) => void;
  onChangeSize: (id: string, oldSize: string, newSize: string) => void;
  currentUser: User | null;
  onAuthNeeded: () => void;
  onRecordOrder: (order: Order) => void;
}

const Cart: React.FC<CartProps> = ({ 
  items, 
  isOpen, 
  onClose, 
  onUpdateQuantity, 
  onRemove, 
  onChangeSize,
  currentUser, 
  onAuthNeeded,
  onRecordOrder
}) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<'website' | 'whatsapp'>('whatsapp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showWhatsAppAuthPrompt, setShowWhatsAppAuthPrompt] = useState(false);
  
  // Confirmation step state
  const [isConfirmingDetails, setIsConfirmingDetails] = useState(false);
  const [confirmPhone, setConfirmPhone] = useState('');
  const [confirmAddress, setConfirmAddress] = useState('');

  useEffect(() => {
    if (currentUser) {
      setConfirmPhone(currentUser.phone || '');
      setConfirmAddress(currentUser.address || '');
    }
  }, [currentUser, isOpen]);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = selectedCity ? selectedCity.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const handleInitialCheckoutClick = () => {
    if (!selectedCity) {
      alert('Please select a delivery location first!');
      return;
    }

    if (!currentUser) {
      if (checkoutMode === 'website') {
        onAuthNeeded();
      } else {
        setShowWhatsAppAuthPrompt(true);
      }
      return;
    }

    if (checkoutMode === 'website') {
      setIsConfirmingDetails(true);
    } else {
      processFinalCheckout();
    }
  };

  const processFinalCheckout = async () => {
    if (!selectedCity) return;
    if (!currentUser && checkoutMode === 'website') return;

    const userId = currentUser?.id || `guest-${Math.random().toString(36).substr(2, 9)}`;
    const userName = currentUser?.name || 'Guest Customer';
    const userPhone = currentUser?.phone || 'WhatsApp Guest';
    const userEmail = currentUser?.email || 'guest@toutiboutique.com';

    const orderData: Order = {
      id: Math.random().toString(36).substr(2, 6),
      userId,
      userName,
      userPhone: checkoutMode === 'website' ? confirmPhone : userPhone,
      userEmail,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      status: 'Pending',
      source: checkoutMode,
      address: checkoutMode === 'website' ? confirmAddress : (currentUser?.address || 'WhatsApp Order')
    };

    if (checkoutMode === 'whatsapp') {
      onRecordOrder(orderData);
      const orderSummary = items.map(i => `${i.name}${i.selectedSize ? ` [Size: ${i.selectedSize}]` : ''} (x${i.quantity}) - $${i.price * i.quantity}`).join('%0A');
      const message = `Hello Touti Boutique! I am ${userName}. I would like to place an order:%0A%0AItems:%0A${orderSummary}%0A%0ASubtotal: $${subtotal}%0ADelivery to ${selectedCity.name}: $${deliveryFee}%0A*Total: $${total}*%0A%0APlease let me know the next steps!`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
      setShowWhatsAppAuthPrompt(false);
    } else {
      setIsProcessing(true);
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 1500));
      onRecordOrder(orderData);
      setIsProcessing(false);
      setOrderComplete(true);
      setIsConfirmingDetails(false);
    }
  };

  if (!isOpen) return null;

  if (orderComplete) {
    return (
      <div className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setOrderComplete(false); onClose(); }} />
        <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black text-[#4A3B18] mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Your online order has been placed. We will contact you soon for confirmation and delivery.</p>
          <button onClick={() => { setOrderComplete(false); onClose(); }} className="w-full bg-[#B89548] text-white font-bold py-4 rounded-2xl shadow-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col relative">
          {showWhatsAppAuthPrompt && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Track your order?</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Create an account to manage your orders, track delivery status, and see your history.
                  </p>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => { setShowWhatsAppAuthPrompt(false); onAuthNeeded(); }}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Create Account / Login
                  </button>
                  <button 
                    onClick={processFinalCheckout}
                    className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Skip & Go to WhatsApp
                  </button>
                  <button 
                    onClick={() => setShowWhatsAppAuthPrompt(false)}
                    className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#4A3B18]">
              {isConfirmingDetails ? 'Confirm Details' : 'Your Shopping Bag'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isConfirmingDetails ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-4">
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-tight">
                    Almost there! Please verify your contact information for the delivery driver.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Phone Number</label>
                    <input 
                      type="tel"
                      value={confirmPhone}
                      onChange={(e) => setConfirmPhone(e.target.value)}
                      placeholder="+961 70 123 456"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B89548] outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Address</label>
                    <textarea 
                      value={confirmAddress}
                      onChange={(e) => setConfirmAddress(e.target.value)}
                      placeholder="Building name, Floor, Street, Landmark..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B89548] outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase">Destination</span>
                      <span className="text-[#4A3B18] font-black">{selectedCity?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase">Total Due</span>
                      <span className="text-[#B89548] font-black">${total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0m-4 7v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                </div>
                <p className="text-slate-500 font-medium">Your bag is empty.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize || 'default'}`} className="flex space-x-4">
                    <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      {(() => {
                        const sizes = item.sizes && item.sizes.length > 0 ? item.sizes : ['0-3M', '3-6M', '6-12M', '12-18M'];
                        return (
                          <div className="mt-1 flex items-center space-x-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Size:</span>
                            <select
                              value={item.selectedSize || sizes[0]}
                              onChange={(e) => onChangeSize(item.id, item.selectedSize || '', e.target.value)}
                              className="bg-slate-50 border border-slate-200 text-[#B89548] text-xs font-black rounded-lg px-2 py-0.5 outline-none focus:ring-1 focus:ring-[#B89548] transition-all cursor-pointer"
                            >
                              {sizes.map((sz) => (
                                <option key={sz} value={sz}>{sz}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}
                      <p className="text-[#B89548] text-xs font-black mt-1">${item.price}</p>
                      <div className="mt-2 flex items-center space-x-3">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-7">
                          <button onClick={() => onUpdateQuantity(item.id, -1, item.selectedSize)} className="px-2 hover:bg-slate-50 text-slate-600">-</button>
                          <span className="px-2 text-xs font-bold text-slate-900 border-x border-slate-200">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1, item.selectedSize)} className="px-2 hover:bg-slate-50 text-slate-600">+</button>
                        </div>
                        <button onClick={() => onRemove(item.id, item.selectedSize)} className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!orderComplete && items.length > 0 && (
            <div className="bg-slate-50 px-6 py-6 space-y-4 border-t border-slate-200">
              {!isConfirmingDetails ? (
                <>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white border border-slate-200 rounded-2xl mb-2">
                    <button 
                      onClick={() => setCheckoutMode('whatsapp')}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${checkoutMode === 'whatsapp' ? 'bg-[#B89548] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      WhatsApp Fast
                    </button>
                    <button 
                      onClick={() => setCheckoutMode('website')}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${checkoutMode === 'website' ? 'bg-[#4A3B18] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Online Order
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipping to</label>
                    <select 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#B89548] transition-all"
                      value={selectedCity?.name || ''}
                      onChange={(e) => {
                        const city = CITIES_LEBANON.find(c => c.name === e.target.value);
                        setSelectedCity(city || null);
                      }}
                    >
                      <option value="">Select Lebanon City</option>
                      {CITIES_LEBANON.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Delivery Fee</span>
                      <span>{selectedCity ? `$${deliveryFee}` : '—'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-[#4A3B18] pt-2">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>

                  {checkoutMode === 'whatsapp' ? (
                    <button 
                      onClick={handleInitialCheckoutClick}
                      disabled={!selectedCity || isProcessing}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:bg-slate-300 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <span>Fast WhatsApp Checkout</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleInitialCheckoutClick}
                      disabled={!selectedCity || isProcessing}
                      className="w-full bg-[#B89548] hover:bg-[#967936] disabled:bg-slate-300 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                    >
                      {isProcessing ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Place Order (Pay on Delivery)</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={processFinalCheckout}
                    disabled={isProcessing || !confirmPhone.trim() || !confirmAddress.trim()}
                    className="w-full bg-[#B89548] hover:bg-[#967936] disabled:bg-slate-300 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                  >
                    {isProcessing ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <span>Confirm & Place Order</span>
                    )}
                  </button>
                  <button 
                    disabled={isProcessing}
                    onClick={() => setIsConfirmingDetails(false)}
                    className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Go Back to Bag
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
