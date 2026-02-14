
import React, { useState } from 'react';
import { Server, Database, ShieldCheck, Activity, Globe, Smartphone, CheckCircle2, Network, Clock, FileCheck, HardDrive, Lock, Cloud, Zap, RefreshCw } from 'lucide-react';

interface ArchitectureViewProps {
  onToggleEmergency?: () => void; // Kept for logic compatibility but hidden in UI
  isEmergency?: boolean;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  service: string;
  status: 'Operational' | 'Maintenance' | 'Update';
  region: string;
}

const ArchitectureView: React.FC<ArchitectureViewProps> = ({ isEmergency }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'updates'>('status');

  // Calm, Transparent Logs (Empty)
  const [activityLogs] = useState<ActivityLog[]>([]);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50">
      
      {/* Header: Professional & Calm */}
      <div className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">
            System Status
          </h1>
          <p className="text-sm text-slate-500">
            Real-time transparency report for Mcommunication services.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-700">All Systems Operational</span>
           </div>
           <span className="text-xs text-slate-400">Last updated: Just now</span>
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         
         {/* 1. Uptime / Stability */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
               <Activity size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">99.99% Uptime</h3>
            <p className="text-xs text-slate-500 mt-1">Platform Stability</p>
            <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-full rounded-full"></div>
            </div>
         </div>

         {/* 2. Data Residency (Replacing Sovereign Cloud) */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
               <Database size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Local Storage</h3>
            <p className="text-xs text-slate-500 mt-1">Data housed in Rabat, Morocco</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
               <CheckCircle2 size={12} /> Data Residency Verified
            </div>
         </div>

         {/* 3. Encryption (Replacing Tier 4 Security) */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600">
               <Lock size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">End-to-End Encrypted</h3>
            <p className="text-xs text-slate-500 mt-1">Your privacy is built-in by default.</p>
            <div className="mt-4 text-[10px] text-slate-400 font-mono">AES-256 / TLS 1.3</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: System Topology (Simplified) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Network className="text-slate-400" size={20} /> Infrastructure Map
                </h3>
             </div>
             
             <div className="p-8 relative">
                {/* Visual Connection Lines */}
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-slate-100"></div>

                <div className="space-y-8 relative z-10">
                   
                   {/* Node 1 */}
                   <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm mt-1"></div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-sm">Citizen App Interface</h4>
                         <p className="text-xs text-slate-500 mt-0.5">Secure Gateway • HTTPS</p>
                      </div>
                   </div>

                   {/* Node 2 */}
                   <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm mt-1"></div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-sm">Verification Layer</h4>
                         <p className="text-xs text-slate-500 mt-0.5">Biometric Matching • Zero-Knowledge Proofs</p>
                      </div>
                   </div>

                   {/* Node 3 */}
                   <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full bg-white border-4 border-emerald-500 shadow-sm mt-1"></div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-sm">National Data Center</h4>
                         <p className="text-xs text-slate-500 mt-0.5">Offline Backups • Physical Security</p>
                      </div>
                   </div>

                </div>
             </div>
          </div>
        </div>

        {/* Right: Transparency Log */}
        <div>
           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Clock className="text-slate-400" size={20} /> System Activity
                 </h3>
              </div>
              <div className="divide-y divide-slate-50">
                 {activityLogs.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm">No recent activity logs.</div>
                 ) : (
                    activityLogs.map(log => (
                        <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                           {/* Log Item */}
                        </div>
                    ))
                 )}
                 <div className="p-4 text-center">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 mx-auto">
                       <RefreshCw size={12} /> View Full Report
                    </button>
                 </div>
              </div>
           </div>

           {/* Security Note (Subtle) */}
           <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-3">
              <ShieldCheck size={20} className="text-slate-400 flex-shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                 Security is integrated into every layer of the platform. We perform automated audits daily to ensure data integrity and availability.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ArchitectureView;
