
import React, { useState } from 'react';
import { X, Wrench, DollarSign, Plus, Save } from 'lucide-react';

interface AddServiceModalProps {
  onClose: () => void;
  onSave: (service: any) => void;
  initialData?: {
    title: string;
    price: string;
    unit: string;
    description: string;
  };
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [unit, setUnit] = useState(initialData?.unit || 'Fixed Price');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSave({
        title,
        price,
        unit,
        description
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
             <Wrench size={20} className="text-brand-green" /> 
             {initialData ? 'Edit Service' : 'Add Service'}
           </h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
             <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Service Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Install Air Conditioner"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-bold text-slate-900"
              />
           </div>

           <div className="flex gap-4">
              <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Price (MAD)</label>
                 <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input 
                        type="number" 
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="300"
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-bold text-slate-900"
                    />
                 </div>
              </div>
              <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Pricing Type</label>
                 <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-medium text-slate-700 appearance-none"
                 >
                    <option value="Fixed Price">Fixed Price</option>
                    <option value="Per Hour">Per Hour</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Starting At">Starting At</option>
                 </select>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description (Optional)</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is included in this service?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm resize-none"
              />
           </div>

           <button 
             type="submit"
             disabled={!title || !price || isSubmitting}
             className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isSubmitting ? (
                <span>{initialData ? 'Saving...' : 'Adding...'}</span>
             ) : (
                <>
                   {initialData ? <Save size={18} /> : <Plus size={18} />}
                   <span>{initialData ? 'Save Changes' : 'Add to Profile'}</span>
                </>
             )}
           </button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
