import React, { useState, useMemo } from 'react';
import { Product } from '../types';

interface AdminInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

const AdminInventoryModal: React.FC<AdminInventoryModalProps> = ({ isOpen, onClose, products, onUpdateProduct }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Flatten products by size so each row represents a specific size of a product
  const inventoryRows = useMemo(() => {
    const rows: {
      productId: string;
      productName: string;
      category: string;
      image: string;
      size: string;
      total: number;
      sold: number;
      remaining: number;
      productRef: Product;
    }[] = [];

    products.forEach(p => {
      const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ['One Size'];
      sizes.forEach(sz => {
        const currentStock = p.stock?.[sz] || { total: 10, sold: 0 };
        rows.push({
          productId: p.id,
          productName: p.name,
          category: p.category,
          image: p.images?.[0] || 'https://via.placeholder.com/100',
          size: sz,
          total: currentStock.total,
          sold: currentStock.sold,
          remaining: Math.max(0, currentStock.total - currentStock.sold),
          productRef: p
        });
      });
    });

    return rows.filter(r => {
      const matchesSearch = r.productName.toLowerCase().includes(search.toLowerCase()) || r.size.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (!isOpen) return null;

  const handleQuickAddStock = (product: Product, size: string, value: number) => {
    const currentStock = product.stock?.[size] || { total: 10, sold: 0 };
    const updatedStock = {
      ...(product.stock || {}),
      [size]: {
        ...currentStock,
        total: currentStock.total + value
      }
    };

    onUpdateProduct({
      ...product,
      stock: updatedStock
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-[#4A3B18]">Inventory & Stock Control</h2>
            <p className="text-xs text-slate-400 mt-1">Monitor available quantities, track items sold, and replenish sizes instantly.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#B89548] text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by product or size..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-10 py-2 text-xs outline-none focus:ring-2 focus:ring-[#B89548] transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          {inventoryRows.length > 0 ? (
            <div className="overflow-x-auto border border-slate-150 rounded-2xl">
              <table className="min-w-full divide-y divide-slate-150">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Product Info</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Total Stock</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Out (Sold)</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Remaining</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {inventoryRows.map((row, idx) => {
                    let statusBadge = (
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        In Stock
                      </span>
                    );
                    if (row.remaining === 0) {
                      statusBadge = (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                          Sold Out
                        </span>
                      );
                    } else if (row.remaining <= 3) {
                      statusBadge = (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                          Low Stock
                        </span>
                      );
                    }

                    return (
                      <tr key={`${row.productId}-${row.size}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img src={row.image} alt={row.productName} className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{row.productName}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{row.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-black text-slate-700">
                          {row.size}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={row.total}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              onUpdateProduct({
                                ...row.productRef,
                                stock: {
                                  ...(row.productRef.stock || {}),
                                  [row.size]: {
                                    ...(row.productRef.stock?.[row.size] || { total: 10, sold: 0 }),
                                    total: val
                                  }
                                }
                              });
                            }}
                            className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-black text-[#B89548] focus:ring-2 focus:ring-[#B89548] outline-none transition-all"
                          />
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-slate-500">
                          {row.sold}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`text-sm font-black ${row.remaining === 0 ? 'text-red-500' : row.remaining <= 3 ? 'text-amber-500' : 'text-slate-900'}`}>
                            {row.remaining}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {statusBadge}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleQuickAddStock(row.productRef, row.size, 5)}
                              className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-[#B89548] hover:text-white text-slate-600 rounded-lg transition-all"
                              title="Add 5 to Stock"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleQuickAddStock(row.productRef, row.size, 10)}
                              className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-[#B89548] hover:text-white text-slate-600 rounded-lg transition-all"
                              title="Add 10 to Stock"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-medium">No inventory data available for search selection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryModal;
