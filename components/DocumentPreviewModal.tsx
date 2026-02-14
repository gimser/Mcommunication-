import React from 'react';
import { X, Download, Share2, ShieldCheck, Printer, FileCheck } from 'lucide-react';
import Logo from './Logo';

interface DocumentData {
  title: string;
  ref: string;
  date: string;
  recipient: string;
  id: string;
  body: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface DocumentPreviewModalProps {
  data: DocumentData;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-50 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Toolbar */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand-green" />
            <span className="font-bold text-sm">Official Document Viewer</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200">
          <div className="bg-white shadow-xl rounded-sm p-8 min-h-[500px] relative text-slate-900 mx-auto max-w-md print:shadow-none">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <Logo className="w-64 h-64 grayscale" />
            </div>

            {/* Document Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
              <div className="flex justify-center mb-4">
                <Logo className="h-8" />
              </div>
              <h1 className="font-display font-bold text-xl uppercase tracking-widest mb-1">Ministry of Youth & Technology</h1>
              <p className="text-xs font-serif text-slate-500">Kingdom of Morocco • Digital Sovereignty Division</p>
            </div>

            {/* Meta Data */}
            <div className="flex justify-between items-end mb-8 text-xs font-mono">
              <div>
                <p className="text-slate-500 mb-1">Reference:</p>
                <p className="font-bold">{data.ref}</p>
              </div>
              <div className="text-right rtl:text-left">
                <p className="text-slate-500 mb-1">Date:</p>
                <p className="font-bold">{data.date}</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 border border-slate-900 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {data.status === 'Approved' ? 'Official Decision' : 'Notice'}
              </span>
              <h2 className="font-display font-bold text-2xl text-slate-900">{data.title}</h2>
            </div>

            {/* Body */}
            <div className="prose prose-sm max-w-none mb-12 font-serif leading-relaxed text-justify">
              <p className="mb-4">
                Dear Citizen <strong>{data.recipient}</strong> (National ID: {data.id}),
              </p>
              <p className="mb-4">
                {data.body}
              </p>
              <p>
                This decision is effective immediately upon digital issuance. The automated rules engine has verified all eligibility criteria in accordance with Law 55-19 on Administrative Simplicity.
              </p>
            </div>

            {/* Signature Area */}
            <div className="flex justify-between items-end mt-12 pt-8">
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-brand-green/30 rounded-full flex items-center justify-center relative mb-2">
                   <div className="absolute inset-2 border border-brand-green/20 rounded-full"></div>
                   <ShieldCheck size={40} className="text-brand-green/20" />
                   <span className="absolute text-[8px] font-bold text-brand-green/40 uppercase tracking-widest rotate-[-15deg]">Verified Digital</span>
                </div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Digital Seal</p>
              </div>

              <div className="text-right rtl:text-left">
                {/* Fake Signature */}
                <div className="font-handwriting text-2xl text-slate-800 mb-2 transform -rotate-2">
                  AutoSigned_GovTech
                </div>
                <p className="text-xs font-bold uppercase">The Minister Delegate</p>
                <p className="text-[10px] text-slate-500">Charged with Digital Transition</p>
              </div>
            </div>

            {/* Footer Strip */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-brand"></div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <Share2 size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-bold">
              <Printer size={18} />
              <span>Print</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-bold shadow-lg shadow-slate-900/20">
              <Download size={18} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentPreviewModal;