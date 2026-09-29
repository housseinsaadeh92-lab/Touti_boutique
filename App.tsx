
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, User, Order, Category, AdminSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import ProductFormModal from './components/ProductFormModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import AdminOrdersModal from './components/AdminOrdersModal';
import AdminSettingsModal from './components/AdminSettingsModal';
import AdminUsersModal from './components/AdminUsersModal';
import AdminInventoryModal from './components/AdminInventoryModal';

const App: React.FC = () => {
  // UI State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  // Admin UI State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isAdminOrdersOpen, setIsAdminOrdersOpen] = useState(false);
  const [isAdminUsersOpen, setIsAdminUsersOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [isAdminInventoryOpen, setIsAdminInventoryOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('touti_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('touti_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('touti_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('touti_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('touti_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('touti_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('touti_settings');
    return saved ? JSON.parse(saved) : {
      smtpHost: 'smtp.toutiboutique.com',
      smtpPort: '587',
      smtpUser: 'notifications@toutiboutique.com',
      smtpPass: '********',
      notificationEmail: 'admin@toutiboutique.com'
    };
  });

  // Persistence Effects
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('touti_user', JSON.stringify(currentUser));
      else localStorage.removeItem('touti_user');
    } catch (e) {
      console.warn('Failed to save user to localStorage:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('touti_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('touti_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('touti_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('touti_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users to localStorage:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('touti_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart items to localStorage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('touti_settings', JSON.stringify(adminSettings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }, [adminSettings]);

  const isAdmin = currentUser?.email === 'admin@toutiboutique.com' || currentUser?.email === 'admin@medioam.com';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVisibility = isAdmin || !p.hidden;
      return matchesCategory && matchesSearch && matchesVisibility;
    });
  }, [selectedCategory, searchQuery, products, isAdmin]);

  const addToCart = (product: Product, size?: string) => {
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size');
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedSize === selectedSize);
      if (existing) {
        return prev.map(i => i.id === product.id && i.selectedSize === selectedSize ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number, size?: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, size?: string) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
  };

  const changeCartItemSize = (id: string, oldSize: string, newSize: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id && i.selectedSize === newSize);
      const targetItem = prev.find(i => i.id === id && i.selectedSize === oldSize);
      
      if (!targetItem) return prev;

      if (existing) {
        // Merge them together by adding quantities
        return prev
          .map(i => {
            if (i.id === id && i.selectedSize === newSize) {
              return { ...i, quantity: i.quantity + targetItem.quantity };
            }
            return i;
          })
          .filter(i => !(i.id === id && i.selectedSize === oldSize));
      } else {
        // Simply change the size on the item
        return prev.map(i => i.id === id && i.selectedSize === oldSize ? { ...i, selectedSize: newSize } : i);
      }
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    localStorage.removeItem('touti_user');
    localStorage.removeItem('touti_cart');
  };

  const recordOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);

    // Update products stock sold quantities automatically
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        const orderItemsForProduct = order.items.filter(item => item.id === product.id);
        if (orderItemsForProduct.length === 0) return product;

        const updatedStock = { ...(product.stock || {}) };
        orderItemsForProduct.forEach(item => {
          const size = item.selectedSize || 'One Size';
          const currentStock = updatedStock[size] || { total: 10, sold: 0 };
          updatedStock[size] = {
            ...currentStock,
            sold: currentStock.sold + item.quantity
          };
        });

        return {
          ...product,
          stock: updatedStock
        };
      });
    });
    
    // Update user profile with latest info from order
    if (currentUser && currentUser.id === order.userId) {
      const updatedUser = {
        ...currentUser,
        phone: order.userPhone,
        address: order.address || currentUser.address
      };
      handleUpdateProfile(updatedUser);
    }

    if (order.source === 'website') {
      simulateEmailNotification(order);
      setCartItems([]);
    }
  };

  const simulateEmailNotification = (order: Order) => {
    console.log(`[SMTP SIMULATOR] Connecting to ${adminSettings.smtpHost}:${adminSettings.smtpPort}...`);
    console.log(`[SMTP SIMULATOR] Sending email to ${adminSettings.notificationEmail}`);
    console.log(`[SMTP SIMULATOR] Content: New Order #${order.id} from ${order.userName}. Total: $${order.total}`);
    // In a real app, this would be a fetch to a backend endpoint.
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === product.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = product;
        return updated;
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      // Remove from cart if it's there
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleProductVisibility = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, hidden: !p.hidden } : p));
  };

  const handleLogin = (user: User) => {
    // Check if user already exists in our "database"
    const existingUser = users.find(u => u.email === user.email);
    
    if (existingUser) {
      setCurrentUser(existingUser);
    } else {
      const newUser = { ...user, joinedAt: user.joinedAt || new Date().toISOString() };
      setCurrentUser(newUser);
      setUsers(prev => [...prev, newUser]);
    }
    setIsAuthOpen(false);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const userOrders = useMemo(() => orders.filter(o => o.userId === currentUser?.id), [orders, currentUser]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF9]">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        onAdminOrdersClick={() => setIsAdminOrdersOpen(true)}
        onAdminUsersClick={() => setIsAdminUsersOpen(true)}
        onAdminSettingsClick={() => setIsAdminSettingsOpen(true)}
        onAdminInventoryClick={() => setIsAdminInventoryOpen(true)}
        onLogout={handleLogout}
      />
      
      {/* Premium Full-Width Cover Banner Image */}
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] bg-slate-50 overflow-hidden border-b border-slate-100">
        <img 
          src="https://images.unsplash.com/photo-1519689680058-324335c77eb2?auto=format&fit=crop&w=2000&q=80" 
          alt="Touti Boutique Collection Banner" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full pb-20">
        <section id="products-section" className="px-4 sm:px-8 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === 'All' 
                  ? 'bg-[#B89548] text-white shadow-lg shadow-[#B89548]/30' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedCategory === cat.name 
                    ? 'bg-[#B89548] text-white shadow-lg shadow-[#B89548]/30' 
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              
              {isAdmin && (
                <div className="flex gap-2 ml-2 pl-4 border-l border-slate-200">
                  <button onClick={() => { setEditingProduct(null); setIsProductFormOpen(true); }} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <button onClick={() => setIsCategoryManagerOpen(true)} className="p-2 bg-[#B89548] text-white rounded-full hover:bg-[#967936] shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative w-full md:w-80">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-3 outline-none focus:ring-2 focus:ring-[#B89548] transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-8 mt-10">
          <h2 className="text-2xl font-black text-[#4A3B18] mb-8">{selectedCategory} Collection</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onViewDetails={setViewingProduct}
                  onAddToCart={addToCart}
                  isAdmin={isAdmin}
                  onEdit={(p) => { setEditingProduct(p); setIsProductFormOpen(true); }}
                  onDelete={deleteProduct}
                  onToggleVisibility={toggleProductVisibility}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-medium">No products found.</p>
            </div>
          )}
        </section>
      </main>

      <ProductDetails product={viewingProduct} allProducts={products} onClose={() => setViewingProduct(null)} onAddToCart={addToCart} onProductSelect={setViewingProduct} />
      <Cart items={cartItems} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onChangeSize={changeCartItemSize} currentUser={currentUser} onAuthNeeded={() => setIsAuthOpen(true)} onRecordOrder={recordOrder} />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={currentUser} onUpdate={handleUpdateProfile} />
      <OrderHistoryModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} orders={userOrders} />
      <ProductFormModal isOpen={isProductFormOpen} onClose={() => setIsProductFormOpen(false)} onSave={saveProduct} editingProduct={editingProduct} categories={categories} />
      <CategoryManagerModal isOpen={isCategoryManagerOpen} onClose={() => setIsCategoryManagerOpen(false)} categories={categories} onAdd={(n) => setCategories([...categories, {id: Math.random().toString(36).substr(2, 9), name: n}])} onDelete={(id) => setCategories(categories.filter(c => c.id !== id))} />
      <AdminOrdersModal isOpen={isAdminOrdersOpen} onClose={() => setIsAdminOrdersOpen(false)} orders={orders} onUpdateStatus={updateOrderStatus} />
      <AdminUsersModal isOpen={isAdminUsersOpen} onClose={() => setIsAdminUsersOpen(false)} users={users} orders={orders} />
      <AdminSettingsModal isOpen={isAdminSettingsOpen} onClose={() => setIsAdminSettingsOpen(false)} settings={adminSettings} onSave={setAdminSettings} />
      <AdminInventoryModal isOpen={isAdminInventoryOpen} onClose={() => setIsAdminInventoryOpen(false)} products={products} onUpdateProduct={saveProduct} />
      <Footer />
    </div>
  );
};

export default App;
