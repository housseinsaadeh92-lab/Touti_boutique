
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onEdit?: (p: Product) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart, onEdit, onDelete, onToggleVisibility, isAdmin }) => {
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image';

  const totalRemainingStock = React.useMemo(() => {
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['0-3M', '3-6M', '6-12M', '12-18M'];
    return sizes.reduce((sum, sz) => {
      const stock = product.stock?.[sz] || { total: 10, sold: 0 };
      return sum + Math.max(0, stock.total - stock.sold);
    }, 0);
  }, [product]);

  const isSoldOut = totalRemainingStock <= 0;

  return (
    <div className={`group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 ${product.hidden ? 'opacity-85 border-dashed border-slate-300' : ''}`}>
      <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img 
          src={primaryImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.hidden && (
          <div className="absolute top-4 left-4 bg-slate-900/85 text-white backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest z-10 shadow-md">
            Hidden from Public
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-1.5 z-10">
          {isAdmin && onToggleVisibility && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(product.id); }}
              className={`p-2.5 rounded-xl shadow-lg transition-colors ${product.hidden ? 'bg-slate-700 text-white hover:bg-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              title={product.hidden ? "Show Product" : "Hide Product"}
            >
              {product.hidden ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
          {isAdmin && onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              className="bg-amber-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-amber-600 transition-colors"
              title="Edit Product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
          )}
          {isAdmin && onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
              className="bg-red-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
              title="Delete Product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-[#B89548] uppercase tracking-[0.15em] mb-1.5 block">
          {product.category}
        </span>
        <h3 className="text-xl font-black text-slate-900 group-hover:text-[#B89548] transition-colors leading-tight">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
            <span className="text-2xl font-black text-[#4A3B18]">${product.price}</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onViewDetails(product)}
              className="p-3 text-slate-400 hover:text-[#B89548] hover:bg-[#B89548]/5 rounded-2xl transition-all"
              title="View Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button 
              disabled={isSoldOut}
              onClick={() => onAddToCart(product)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                isSoldOut
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-[#B89548] hover:bg-[#967936] text-white shadow-md hover:shadow-[#B89548]/20'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
