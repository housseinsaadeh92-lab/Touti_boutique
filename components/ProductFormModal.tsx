
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct: Product | null;
  categories: Category[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, editingProduct, categories }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: categories[0]?.name || '',
    price: 0,
    description: '',
    images: [''],
    specs: [''],
    sizes: [''],
    stock: {}
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        description: editingProduct.description,
        images: editingProduct.images?.length > 0 ? [...editingProduct.images] : [''],
        specs: editingProduct.specs?.length > 0 ? [...editingProduct.specs] : [''],
        sizes: editingProduct.sizes?.length > 0 ? [...editingProduct.sizes] : [''],
        stock: editingProduct.stock ? { ...editingProduct.stock } : {}
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.name || '',
        price: 0,
        description: '',
        images: [''],
        specs: [''],
        sizes: [''],
        stock: {}
      });
    }
  }, [editingProduct, isOpen, categories]);

  if (!isOpen) return null;

  const handleSizeChange = (index: number, newSize: string) => {
    const oldSize = formData.sizes ? formData.sizes[index] : '';
    const newSizes = formData.sizes ? [...formData.sizes] : [''];
    newSizes[index] = newSize;

    const newStock = { ...(formData.stock || {}) };
    if (oldSize && newStock[oldSize]) {
      newStock[newSize] = { ...newStock[oldSize] };
      delete newStock[oldSize];
    } else if (newSize) {
      newStock[newSize] = newStock[newSize] || { total: 10, sold: 0 };
    }

    setFormData({ ...formData, sizes: newSizes, stock: newStock });
  };

  const handleStockTotalChange = (size: string, total: number) => {
    if (!size) return;
    const newStock = { ...(formData.stock || {}) };
    const current = newStock[size] || { total: 10, sold: 0 };
    newStock[size] = { ...current, total };
    setFormData({ ...formData, stock: newStock });
  };

  const handleRemoveSize = (index: number, size: string) => {
    const newSizes = formData.sizes ? formData.sizes.filter((_, i) => i !== index) : [''];
    const newStock = { ...(formData.stock || {}) };
    if (size) {
      delete newStock[size];
    }
    setFormData({ 
      ...formData, 
      sizes: newSizes.length ? newSizes : [''], 
      stock: newStock 
    });
  };

  const handleArrayChange = (field: 'images' | 'specs' | 'sizes', index: number, value: string) => {
    const newArr = [...formData[field] as string[]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: 'images' | 'specs' | 'sizes') => {
    setFormData({ ...formData, [field]: [...(formData[field] as string[]), ''] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // compress to 70% quality JPEG
            
            setFormData(prev => {
              const lastImg = prev.images[prev.images.length - 1];
              if (lastImg === '') {
                const newImages = [...prev.images];
                newImages[newImages.length - 1] = compressedBase64;
                return { ...prev, images: newImages };
              }
              return { ...prev, images: [...prev.images, compressedBase64] };
            });
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const removeArrayItem = (field: 'images' | 'specs' | 'sizes', index: number) => {
    const newArr = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr.length ? newArr : [''] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSizes = formData.sizes ? formData.sizes.filter(s => s.trim() !== '') : [];
    const finalStock: Product['stock'] = {};
    cleanSizes.forEach(size => {
      finalStock[size] = formData.stock?.[size] || { total: 10, sold: 0 };
    });

    onSave({
      ...formData,
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      images: formData.images.filter(img => img.trim() !== ''),
      specs: formData.specs.filter(s => s.trim() !== ''),
      sizes: cleanSizes,
      stock: finalStock
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-[#4A3B18]">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Basic Info</label>
                <div className="space-y-4">
                  <input 
                    required
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none"
                  />
                  <div className="flex gap-4">
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none"
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <input 
                      required
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Image Gallery</label>
                  <div className="flex gap-3">
                    <label className="text-xs font-bold text-[#B89548] hover:underline cursor-pointer flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Upload
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button type="button" onClick={() => addArrayItem('images')} className="text-xs font-bold text-[#B89548] hover:underline">+ Add URL</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                        {img ? (
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input 
                          required
                          type="text"
                          value={img}
                          onChange={e => handleArrayChange('images', idx, e.target.value)}
                          placeholder="Image URL or Uploaded Data"
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none text-xs truncate"
                        />
                        <button type="button" onClick={() => removeArrayItem('images', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Specifications</label>
                  <button type="button" onClick={() => addArrayItem('specs')} className="text-xs font-bold text-[#B89548] hover:underline">+ Add Spec</button>
                </div>
                <div className="space-y-2">
                  {formData.specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        value={spec}
                        onChange={e => handleArrayChange('specs', idx, e.target.value)}
                        placeholder={`Spec ${idx + 1}`}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none"
                      />
                      <button type="button" onClick={() => removeArrayItem('specs', idx)} className="p-2 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Available Sizes & Stock</label>
                  <button type="button" onClick={() => addArrayItem('sizes')} className="text-xs font-bold text-[#B89548] hover:underline">+ Add Size & Stock</button>
                </div>
                <div className="space-y-3">
                  {(formData.sizes || ['']).map((size, idx) => {
                    const currentStock = formData.stock?.[size] || { total: 10, sold: 0 };
                    return (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text"
                          value={size}
                          onChange={e => handleSizeChange(idx, e.target.value)}
                          placeholder="e.g. 0-3M, 3-6M, 2T, 3T"
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B89548] outline-none"
                        />
                        <div className="flex items-center space-x-1 flex-shrink-0 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Stock:</span>
                          <input 
                            type="number"
                            value={currentStock.total}
                            onChange={e => handleStockTotalChange(size, Math.max(0, Number(e.target.value)))}
                            className="w-16 bg-transparent text-[#B89548] text-xs font-black outline-none text-center"
                          />
                        </div>
                        <button type="button" onClick={() => handleRemoveSize(idx, size)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 sticky bottom-0 bg-white">
            <button 
              type="submit"
              className="w-full bg-[#B89548] hover:bg-[#967936] text-white font-black py-4 rounded-xl shadow-lg transition-all"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
