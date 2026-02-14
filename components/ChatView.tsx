
import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Video, Info, Send, Image as ImageIcon, Mic, ChevronLeft, ShieldCheck, Check, CheckCheck, MoreVertical, Paperclip, Lock, PhoneOff, MicOff, Volume2, X, Play, Pause, Trash2, Copy, Reply, Flag, Ban, Archive, BellOff, UserPlus, Users, FileText, Bot, Sparkles, Zap, Database, StopCircle, Brain, HeartHandshake, Coffee, MessageCircle, Camera, Smile, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

// Types
interface Message {
  id: string;
  text?: string;
  image?: string; 
  audioDuration?: string; // For voice notes
  sender: 'me' | 'them' | 'system';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'call_log' | 'voice' | 'system';
  replyTo?: string; 
}

const ChatView: React.FC = () => {
  const { t, dir } = useLanguage();
  const { contacts } = useContent(); 
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  // Local messages state with SCENARIO 7 PRE-LOADED CONVERSATION
  const [messagesStore, setMessagesStore] = useState<Record<string, Message[]>>({
    'gov-support': [
      { id: '1', text: "Welcome to Mcommunication 3.0. This line is secure.", sender: 'system', timestamp: "09:00", status: 'read', type: 'text' }
    ],
    'user-amine': [ // Scenario 7 Demo User
      { id: 'a1', text: "Salam Maâlem, I saw your profile.", sender: 'them', timestamp: "10:30", status: 'read', type: 'text' },
      { id: 'a2', text: "عندي مشكل في الضو، بشحال كتخدم؟", sender: 'them', timestamp: "10:32", status: 'read', type: 'text' }
    ]
  });
  
  // SCENARIO 7: SMART REPLIES STATE
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Call State
  const [activeCall, setActiveCall] = useState<{isActive: boolean, type: 'audio' | 'video', minimized: boolean} | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Merge context contacts with local scenario contact
  const demoContacts = [
      { 
        id: 'user-amine', 
        name: "Amine Client", 
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", 
        lastMessage: "بشحال كتخدم؟", 
        time: "2m", 
        unread: 1, 
        isOnline: true, 
        role: "Client", 
        isVerified: false 
      },
      ...contacts
  ];

  const activeContact = demoContacts.find(c => c.id === selectedChatId);
  const currentMessages = selectedChatId ? (messagesStore[selectedChatId] || []) : [];

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, selectedChatId, isRecording]);

  // SCENARIO 7: CONTEXT AWARE AI REPLIES
  useEffect(() => {
      if (!currentMessages.length) return;

      const lastMsg = currentMessages[currentMessages.length - 1];
      
      // Only suggest if the last message is from THEM
      if (lastMsg.sender === 'them') {
          const text = lastMsg.text?.toLowerCase() || '';
          
          // Pattern Matching for "How Much?"
          if (text.includes('بشحال') || text.includes('bchhal') || text.includes('prix') || text.includes('price') || text.includes('ثمن')) {
              setQuickReplies([
                  "على حساب الخدمة 🛠️",
                  "نشوف ونعطيك الثمن 👁️",
                  "مرحبا خويا 🤝"
              ]);
          } 
          // Pattern for Location
          else if (text.includes('fin') || text.includes('where') || text.includes('location') || text.includes('adresse')) {
              setQuickReplies([
                  "Send Location 📍",
                  "Maârif",
                  "موجود فالدار البيضاء"
              ]);
          }
          // Pattern for Greetings
          else if (text.includes('salam') || text.includes('hello') || text.includes('hi')) {
              setQuickReplies([
                  "Wa alaykoum salam",
                  "Marhba bik",
                  "Labas 3lik?"
              ]);
          }
          else {
              // Default Sawab
              setQuickReplies(["Allah yhafdek 🙏", "Ok, mchina 🤝", "Choukran bzaf ✨"]);
          }
      } else {
          // If I sent the last message, show follow-ups or empty
          setQuickReplies(["Send Invoice 📄", "Share Location 📍"]);
      }

  }, [currentMessages]);

  // Recording Timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = (e?: React.FormEvent, type: 'text' | 'voice' = 'text', content?: string) => {
    e?.preventDefault();
    if (!selectedChatId) return;
    
    const textToSend = content || inputText;
    if (type === 'text' && !textToSend.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: type === 'text' ? textToSend : undefined,
      audioDuration: type === 'voice' ? formatTime(recordingTime) : undefined,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: type
    };

    setMessagesStore(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    setInputText('');
    setIsRecording(false);

    // Simulate Reply only for Gov Support
    if (selectedChatId === 'gov-support') {
        setTimeout(() => {
            const reply: Message = {
                id: Date.now().toString(),
                text: "Thank you for your message. An agent will verify your request.",
                sender: 'system',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'read',
                type: 'text'
            };
            setMessagesStore(prev => ({
                ...prev,
                [selectedChatId]: [...(prev[selectedChatId] || []), reply]
            }));
        }, 1500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedChatId) {
        const url = URL.createObjectURL(e.target.files[0]);
        const msg: Message = {
            id: Date.now().toString(),
            image: url,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            type: 'image'
        };
        setMessagesStore(prev => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), msg]
        }));
    }
  };

  const startCall = (type: 'audio' | 'video') => {
      setActiveCall({ isActive: true, type, minimized: false });
  };

  const endCall = () => {
      if (selectedChatId && activeCall) {
          const msg: Message = {
              id: Date.now().toString(),
              text: `Call ended • ${formatTime(recordingTime)}`, // reusing recording time var for demo
              sender: 'me',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read',
              type: 'call_log'
          };
          setMessagesStore(prev => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), msg]
        }));
      }
      setActiveCall(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- COMPONENT: CALL OVERLAY ---
  const CallOverlay = () => {
      if (!activeCall || !activeContact) return null;
      return (
          <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col animate-fade-in">
              {/* Video Background Simulation */}
              {activeCall.type === 'video' && (
                  <div className="absolute inset-0 opacity-30">
                      <img src={activeContact.avatar} className="w-full h-full object-cover blur-sm" />
                  </div>
              )}
              
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
                  <div className="w-32 h-32 rounded-full border-4 border-white/20 p-1 mb-6 shadow-2xl relative">
                      <img src={activeContact.avatar} className="w-full h-full rounded-full object-cover" />
                      {activeCall.type === 'audio' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-brand-green/20 animate-ping"></div>
                          </div>
                      )}
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-2">{activeContact.name}</h2>
                  <p className="text-slate-300 font-medium animate-pulse">
                      {activeCall.type === 'video' ? 'Video Calling...' : 'Audio Calling...'}
                  </p>
              </div>

              {/* Controls */}
              <div className="p-8 pb-12 flex justify-center items-center gap-6 relative z-10 bg-gradient-to-t from-black/80 to-transparent">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full ${isMuted ? 'bg-white text-slate-900' : 'bg-white/20 text-white backdrop-blur-md'}`}>
                      {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                  
                  <button onClick={endCall} className="p-5 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40 hover:scale-105 transition-transform">
                      <PhoneOff size={32} />
                  </button>

                  {activeCall.type === 'video' && (
                      <button onClick={() => setIsCameraOn(!isCameraOn)} className={`p-4 rounded-full ${!isCameraOn ? 'bg-white text-slate-900' : 'bg-white/20 text-white backdrop-blur-md'}`}>
                          {isCameraOn ? <Video size={24} /> : <X size={24} />} 
                      </button>
                  )}
                  {activeCall.type === 'audio' && (
                      <button className="p-4 rounded-full bg-white/20 text-white backdrop-blur-md">
                          <Volume2 size={24} />
                      </button>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-white border border-slate-200 md:rounded-2xl shadow-sm flex overflow-hidden relative">
      
      {/* Call UI */}
      {activeCall && <CallOverlay />}

      {/* --- LEFT SIDEBAR (CONTACTS) --- */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white absolute md:relative z-10 h-full transition-transform duration-300 ${selectedChatId ? '-translate-x-full md:translate-x-0 rtl:translate-x-full rtl:md:translate-x-0' : 'translate-x-0'}`}>
        
        <div className="p-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-4">{t('chat.title')}</h2>
            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder={t('chat.search')} 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-brand-green outline-none transition-all"
                />
            </div>
            
            {/* Story/Status row */}
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-brand-green hover:text-brand-green">
                        <Camera size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">My Status</span>
                </div>
                {demoContacts.filter(c => c.isOnline).map(c => (
                    <div key={c.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setSelectedChatId(c.id)}>
                        <div className="w-14 h-14 rounded-full p-0.5 border-2 border-brand-green">
                            <img src={c.avatar} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate w-14 text-center">{c.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {demoContacts.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <p>No contacts yet. Connect with professionals to start chatting.</p>
                </div>
            ) : (
                demoContacts.map(contact => (
                    <div 
                        key={contact.id}
                        onClick={() => setSelectedChatId(contact.id)}
                        className={`flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${selectedChatId === contact.id ? 'bg-slate-50' : ''}`}
                    >
                        <div className="relative">
                            <img src={contact.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                            {contact.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1">
                                    {contact.name}
                                    {contact.isVerified && <ShieldCheck size={12} className="text-brand-blue" />}
                                </h4>
                                <span className={`text-[10px] font-medium ${contact.unread > 0 ? 'text-brand-green' : 'text-slate-400'}`}>{contact.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className={`text-xs truncate ${contact.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                    {contact.lastMessage}
                                </p>
                                {contact.unread > 0 && (
                                    <span className="bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                        {contact.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* --- RIGHT SIDE (CHAT AREA) --- */}
      <div className={`flex-1 flex flex-col bg-[#e5ddd5]/30 relative w-full h-full transition-transform duration-300 ${selectedChatId ? 'translate-x-0' : 'translate-x-full md:translate-x-0 rtl:-translate-x-full rtl:md:translate-x-0'}`}>
         
         {activeContact ? (
             <>
                {/* Chat Header */}
                <div className="h-16 px-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedChatId(null)} className="md:hidden p-1 text-slate-500">
                            <ChevronLeft size={24} className="rtl:rotate-180" />
                        </button>
                        <div className="relative">
                            <img src={activeContact.avatar} className="w-10 h-10 rounded-full object-cover" />
                            {activeContact.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                                {activeContact.name}
                                {activeContact.isVerified && <CheckCircle2 size={12} className="text-brand-green" />}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {activeContact.isOnline ? 'Online' : 'Last seen today at 10:30'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => startCall('audio')} className="p-2.5 text-brand-green hover:bg-green-50 rounded-full transition-colors">
                            <Phone size={20} />
                        </button>
                        <button onClick={() => startCall('video')} className="p-2.5 text-brand-green hover:bg-green-50 rounded-full transition-colors">
                            <Video size={20} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                            <Info size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')]">
                    {/* Encryption Notice */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-50 text-yellow-800 text-[10px] px-3 py-1.5 rounded-lg border border-yellow-100 flex items-center gap-1.5 shadow-sm">
                            <Lock size={10} />
                            Messages are end-to-end encrypted. No one outside of this chat, not even Mcommunication, can read or listen to them.
                        </div>
                    </div>

                    {currentMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm relative group ${
                                msg.sender === 'me' 
                                    ? 'bg-brand-green text-white rounded-br-sm' 
                                    : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
                            }`}>
                                {/* Image Content */}
                                {msg.type === 'image' && msg.image && (
                                    <div className="mb-2 -mx-2 -mt-2">
                                        <img src={msg.image} className="rounded-xl max-h-60 object-cover" />
                                    </div>
                                )}

                                {/* Voice Content */}
                                {msg.type === 'voice' && (
                                    <div className="flex items-center gap-3 min-w-[150px] py-1">
                                        <button className={`p-2 rounded-full ${msg.sender === 'me' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            <Play size={16} fill="currentColor" />
                                        </button>
                                        <div className="flex flex-col flex-1">
                                            <div className={`h-1 w-full rounded-full mb-1 ${msg.sender === 'me' ? 'bg-white/40' : 'bg-slate-200'}`}>
                                                <div className={`h-full w-1/3 rounded-full ${msg.sender === 'me' ? 'bg-white' : 'bg-slate-400'}`}></div>
                                            </div>
                                            <span className="text-[10px] opacity-80 font-mono">{msg.audioDuration}</span>
                                        </div>
                                        <Mic size={16} className="opacity-50" />
                                    </div>
                                )}

                                {/* Text Content */}
                                {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                                {/* Metadata */}
                                <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-slate-400'}`}>
                                    <span className="text-[10px]">{msg.timestamp}</span>
                                    {msg.sender === 'me' && (
                                        <span className={msg.status === 'read' ? 'text-blue-200' : ''}>
                                            {msg.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sawab Suggestions (Quick Replies) */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto scrollbar-hide">
                    {/* SCENARIO 7: Context-aware replies */}
                    {quickReplies.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 rounded-lg mr-2 shrink-0">
                            <Sparkles size={10} className="text-brand-yellow" />
                            <span>AI</span>
                        </div>
                    )}
                    {quickReplies.map((sawab, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSendMessage(undefined, 'text', sawab)}
                            className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-brand-green hover:text-brand-green transition-colors"
                        >
                            {sawab}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-end gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Paperclip size={22} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                    <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 py-2 min-h-[48px]">
                        {!isRecording ? (
                            <input 
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none outline-none text-slate-900 text-sm placeholder-slate-500"
                            />
                        ) : (
                            <div className="flex items-center gap-3 w-full text-red-500 animate-pulse">
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="font-mono font-bold">{formatTime(recordingTime)}</span>
                                <span className="text-xs text-slate-400 font-medium ml-auto">Recording...</span>
                            </div>
                        )}
                    </div>

                    {inputText || isRecording ? (
                        <button 
                            onClick={(e) => handleSendMessage(e, isRecording ? 'voice' : 'text')}
                            className="p-3 bg-brand-green text-white rounded-full shadow-lg hover:bg-green-700 transition-transform transform active:scale-90"
                        >
                            <Send size={20} className="ltr:ml-0.5 rtl:mr-0.5" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsRecording(true)}
                            className="p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors"
                        >
                            <Mic size={20} />
                        </button>
                    )}
                </div>
             </>
         ) : (
             // Empty State
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                     <MessageCircle size={64} className="text-slate-300" />
                 </div>
                 <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Government Secure Chat</h2>
                 <p className="text-slate-500 max-w-xs mb-8">
                     {demoContacts.length === 0 
                       ? "No conversations yet. Connect with professionals or friends to start chatting."
                       : "Select a conversation to start chatting securely."}
                 </p>
                 <div className="flex items-center gap-2 text-xs font-bold text-brand-green bg-green-50 px-4 py-2 rounded-full border border-green-100">
                     <Lock size={12} /> End-to-End Encrypted
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default ChatView;
