
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';

interface ProductDetailsProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (p: Product, size?: string) => void;
  onProductSelect: (p: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  allProducts, 
  onClose, 
  onAddToCart,
  onProductSelect 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const availableSizes = useMemo(() => {
    if (!product) return [];
    return product.sizes && product.sizes.length > 0 ? product.sizes : ['0-3M', '3-6M', '6-12M', '12-18M'];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    setActiveIndex(0);
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [product, availableSizes]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  if (!product) return null;

  const images = product.images || [];
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#4A3B18]/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur p-3 rounded-2xl hover:bg-white shadow-lg transition-colors text-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-1/2 flex flex-col bg-slate-50 border-r border-slate-100">
          <div className="relative flex-1 min-h-[300px] md:min-h-0">
            <img 
              src={images[activeIndex]} 
              alt={`${product.name} view ${activeIndex + 1}`} 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-xl shadow-md hover:bg-white text-[#B89548] transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-xl shadow-md hover:bg-white text-[#B89548] transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="p-4 flex justify-center space-x-2 bg-white/50 backdrop-blur border-t border-slate-100 overflow-x-auto">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeIndex === idx ? 'border-[#B89548] scale-110 shadow-lg' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="flex items-center space-x-2 text-[#B89548] font-black text-[10px] tracking-[0.2em] uppercase mb-3">
              <span>{product.category}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{product.name}</h2>
            <div className="text-3xl font-black text-[#B89548] mb-6">${product.price}</div>
            
            <p className="text-slate-600 leading-relaxed text-base mb-8">
              {product.description}
            </p>

            <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Specifications</h4>
              <ul className="grid grid-cols-1 gap-2.5">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-center text-slate-700 text-sm font-semibold">
                    <div className="w-4 h-4 bg-[#B89548]/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#B89548]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {availableSizes.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Available Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => {
                    const currentStock = product.stock?.[sz] || { total: 10, sold: 0 };
                    const isOutOfStock = currentStock.total - currentStock.sold <= 0;
                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                          isOutOfStock
                            ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                            : selectedSize === sz
                              ? 'bg-[#B89548] text-white border-[#B89548] shadow-md shadow-[#B89548]/15'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {sz} {isOutOfStock && <span className="text-[8px] lowercase font-normal">(sold out)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {(() => {
              const selectedStock = product.stock?.[selectedSize] || { total: 10, sold: 0 };
              const isSelectedOutOfStock = selectedStock.total - selectedStock.sold <= 0;
              return (
                <button 
                  disabled={isSelectedOutOfStock}
                  onClick={() => {
                    onAddToCart(product, selectedSize);
                    onClose();
                  }}
                  className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all mb-12 ${
                    isSelectedOutOfStock
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                      : 'bg-[#B89548] hover:bg-[#967936] text-white shadow-[#B89548]/20'
                  }`}
                >
                  {isSelectedOutOfStock ? 'Sold Out in Selected Size' : 'Add to Shopping Cart'}
                </button>
              );
            })()}

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Similar Styles</h3>
                <div className="grid grid-cols-2 gap-4">
                  {relatedProducts.map(p => (
                    <div 
                      key={p.id} 
                      className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-3 transition-all hover:border-[#B89548]/30 hover:shadow-md"
                      onClick={() => onProductSelect(p)}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                        <img src={p.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={p.name} />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(p);
                          }}
                          className="absolute bottom-2 right-2 bg-[#B89548] text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mb-1">{p.name}</h4>
                      <div className="text-[#B89548] text-sm font-black">${p.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
