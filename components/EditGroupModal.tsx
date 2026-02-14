
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save, Lock, Globe, Hash, Trash2, Shield, Users, AlertTriangle, ChevronRight, Upload, Search, UserCheck, UserX, MoreVertical, Check, Ban, ShieldAlert, UserPlus, UserMinus, ShieldCheck, Crown, RefreshCcw, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EditGroupModalProps {
  onClose: () => void;
  groupData: {
    id: number;
    name: string;
    type: string; // 'private' | 'buzz'
    role: string;
    image: string;
    members?: number | string;
    description?: string;
  };
  onSave: (data: any) => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ onClose, groupData, onSave }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'requests'>('members');
  const [memberFilter, setMemberFilter] = useState<'active' | 'leadership' | 'restricted'>('active');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for active member dropdown menu
  const [activeMemberMenuId, setActiveMemberMenuId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: groupData.name,
    description: groupData.description || "A community for innovation and growth within the national tech ecosystem.",
    type: groupData.type,
    image: groupData.image,
    requiresApproval: true,
    allowMemberPosts: true
  });

  // Mock Members Data (Empty)
  const [members, setMembers] = useState<any[]>([]);

  // Mock Requests Data (Empty)
  const [requests, setRequests] = useState<any[]>([]);

  // Close menus on click outside
  useEffect(() => {
    const handleClick = () => setActiveMemberMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSave(formData);
      onClose();
    }, 1500);
  };

  const handleDelete = () => {
    if(confirm("Are you sure you want to dissolve this group? This action cannot be undone.")) {
      alert("Group deleted successfully.");
      onClose();
    }
  };

  // Member Management Actions
  const handleRequestAction = (id: number, action: 'accept' | 'reject') => {
    if (action === 'accept') {
      const user = requests.find(r => r.id === id);
      if (user) {
        setMembers([...members, { id: user.id, name: user.name, role: "Member", avatar: user.avatar, joined: "Just now" }]);
      }
    }
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleRemoveMember = (id: number) => {
    setActiveMemberMenuId(null);
    setTimeout(() => {
      if(confirm("Permanently remove this member from the group?")) {
        setMembers(members.filter(m => m.id !== id));
      }
    }, 100);
  };

  const handleBanMember = (id: number) => {
    setActiveMemberMenuId(null);
    setTimeout(() => {
      if(confirm("Restrict this member? They will be moved to the restricted list and cannot post.")) {
        setMembers(members.map(m => m.id === id ? { ...m, role: 'Banned' } : m));
      }
    }, 100);
  };

  const handleRevokeBan = (id: number) => {
    setActiveMemberMenuId(null);
    setTimeout(() => {
      setMembers(members.map(m => m.id === id ? { ...m, role: 'Member' } : m));
    }, 100);
  }

  const handleRoleChange = (id: number, newRole: string) => {
    setActiveMemberMenuId(null);
    setTimeout(() => {
      setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
    }, 100);
  };

  // Filtering Logic
  const filteredMembers = members.filter(m => {
    if (memberFilter === 'leadership') return ['Admin', 'Moderator'].includes(m.role);
    if (memberFilter === 'restricted') return m.role === 'Banned';
    // 'active' shows everyone except banned
    return m.role !== 'Banned';
  });

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-50 w-full h-full md:h-[90vh] md:max-w-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <X size={24} />
            </button>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">Manage Group</h2>
              <p className="text-xs text-slate-500">{formData.name}</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex gap-6">
          {[
            { id: 'general', label: 'Settings', icon: Lock },
            { id: 'members', label: `Members (${members.filter(m => m.role !== 'Banned').length})`, icon: Users },
            { id: 'requests', label: `Requests (${requests.length})`, icon: UserCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-brand-green text-brand-green' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              {tab.id === 'requests' && requests.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{requests.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          
          {/* ================= GENERAL TAB ================= */}
          {activeTab === 'general' && (
            <div>
              {/* Cover Image Section */}
              <div className="relative h-48 bg-slate-200 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img 
                  src={formData.image} 
                  alt="Group Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                     <Camera size={20} />
                     <span>Change Cover</span>
                   </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="p-6 space-y-8 max-w-xl mx-auto">
                {/* Basic Info */}
                <section className="space-y-4">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Information</h3>
                   
                   <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1.5">Group Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-bold text-slate-900"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                       <textarea 
                         rows={4}
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm resize-none"
                       />
                     </div>
                   </div>
                </section>

                {/* Privacy & Type */}
                <section className="space-y-4">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Privacy & Access</h3>
                   
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                     <button 
                       onClick={() => setFormData({...formData, type: 'public'})}
                       className={`w-full flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${formData.type === 'buzz' || formData.type === 'public' ? 'bg-brand-green/5' : ''}`}
                     >
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                           <Globe size={20} />
                         </div>
                         <div className="text-left rtl:text-right">
                           <p className="font-bold text-slate-900 text-sm">Public / Buzz Zone</p>
                           <p className="text-xs text-slate-500">Anyone can see who's in the group and what they post.</p>
                         </div>
                       </div>
                       {(formData.type === 'buzz' || formData.type === 'public') && <div className="w-4 h-4 rounded-full bg-brand-green"></div>}
                     </button>

                     <button 
                       onClick={() => setFormData({...formData, type: 'private'})}
                       className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${formData.type === 'private' ? 'bg-brand-green/5' : ''}`}
                     >
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                           <Lock size={20} />
                         </div>
                         <div className="text-left rtl:text-right">
                           <p className="font-bold text-slate-900 text-sm">Private Cluster</p>
                           <p className="text-xs text-slate-500">Only members can see who's in the group and what they post.</p>
                         </div>
                       </div>
                       {formData.type === 'private' && <div className="w-4 h-4 rounded-full bg-brand-green"></div>}
                     </button>
                   </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-6 border-t border-slate-200">
                   <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                         <AlertTriangle size={20} />
                       </div>
                       <div>
                         <p className="font-bold text-red-900 text-sm">Dissolve Group</p>
                         <p className="text-xs text-red-700/70">Irreversible action.</p>
                       </div>
                     </div>
                     <button 
                       onClick={handleDelete}
                       className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                     >
                       Delete
                     </button>
                   </div>
                </section>
              </div>
            </div>
          )}

          {/* ================= MEMBERS TAB ================= */}
          {/* Added extra padding-bottom (pb-40) to prevent dropdown clipping */}
          {activeTab === 'members' && (
            <div className="p-6 max-w-xl mx-auto space-y-6 min-h-[400px] pb-40">
               
               {/* Filters & Search */}
               <div className="flex flex-col gap-4">
                 <div className="relative">
                   <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search members..." 
                     className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-green"
                   />
                 </div>
                 
                 <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    <button 
                      onClick={() => setMemberFilter('active')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${memberFilter === 'active' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setMemberFilter('leadership')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${memberFilter === 'leadership' ? 'bg-brand-yellow/20 text-brand-yellow-dark border border-brand-yellow/50' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      <Crown size={12} /> Leadership
                    </button>
                    <button 
                      onClick={() => setMemberFilter('restricted')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${memberFilter === 'restricted' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      <Ban size={12} /> Restricted
                    </button>
                 </div>
               </div>

               <div className="space-y-3">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                   <span>{memberFilter === 'restricted' ? 'Restricted Accounts' : 'Members List'}</span>
                   <span>{filteredMembers.length}</span>
                 </h3>
                 
                 {filteredMembers.length === 0 ? (
                   <div className="text-center py-10 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                     <p>No members found in this category.</p>
                   </div>
                 ) : (
                   filteredMembers.map(member => (
                     /* Member item rendering ... */
                     <div key={member.id}></div> // Placeholder for mapped items to keep structure valid
                   ))
                 )}
               </div>
            </div>
          )}

          {/* ================= REQUESTS TAB ================= */}
          {activeTab === 'requests' && (
            <div className="p-6 max-w-xl mx-auto space-y-6">
               {requests.length === 0 ? (
                 <div className="text-center py-10 text-slate-400">
                   <UserCheck size={48} className="mx-auto mb-4 opacity-50" />
                   <p>No pending requests.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {/* Requests mapping ... */}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
