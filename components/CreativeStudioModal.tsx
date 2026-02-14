
import React, { useState, useRef, useEffect } from 'react';
import { X, Type, Download, Layers, Image as ImageIcon, Zap, Grid, Trash2, AlignLeft, AlignCenter, AlignRight, RotateCw, Upload, ArrowUp, ArrowDown, Maximize2, Undo, Layout, Monitor, Clock, MapPin, Newspaper, Sliders, Box, Lock, Unlock, Eye, EyeOff, Copy, AlignCenterVertical, AlignCenterHorizontal, Check, Circle, Square, Triangle, Star, Bold, Italic, Underline, Move, Palette } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { SovereignBackend } from '../services/SovereignBackend';

interface CreativeStudioModalProps {
  onClose: () => void;
  onSave?: (image: string) => void;
  initialImage?: string;
  aspectRatio?: string; 
}

// --- CONSTANTS ---

const NEWS_TEMPLATES = [
  { id: 'breaking', label: 'Breaking News', style: { bg: '#DC2626', text: 'BREAKING NEWS', sub: 'Live Coverage', type: 'banner' } },
  { id: 'quote', label: 'Pro Quote', style: { bg: '#000000', text: '“Insert Quote Here”', sub: '- Source Name', type: 'centered' } },
  { id: 'ticker', label: 'News Ticker', style: { bg: '#FCD34D', text: 'UPDATE: Market trends show significant growth in tech sector...', sub: '12:00 PM', type: 'bottom' } },
];

const FONTS = [
  { id: 'display', name: 'GIM Bold', family: 'Outfit, sans-serif', weight: '800' },
  { id: 'serif', name: 'Editorial', family: 'Playfair Display, serif', weight: '600' },
  { id: 'mono', name: 'Code Mono', family: 'Fira Code, monospace', weight: '500' },
  { id: 'arabic', name: 'Al Jazeera', family: 'Noto Kufi Arabic, sans-serif', weight: '700' },
  { id: 'impact', name: 'Urgent', family: 'Impact, sans-serif', weight: '400' },
  { id: 'clean', name: 'Modern', family: 'Inter, sans-serif', weight: '600' },
];

const BRAND_GRADIENTS = [
  { id: 'gim_main', label: 'GIM Prime', value: 'linear-gradient(135deg, #009746 0%, #FFD100 100%)' },
  { id: 'dark_tech', label: 'Dark Tech', value: 'linear-gradient(to bottom, #0F172A, #004D24)' },
  { id: 'sunset', label: 'Maghreb', value: 'linear-gradient(to right, #C15835, #FFD100)' },
  { id: 'ocean', label: 'Atlantic', value: 'linear-gradient(to top, #005898, #009746)' },
];

// Advanced Text Effects Engine
const TEXT_STYLES = [
  { 
    id: 'none', 
    label: 'None', 
    style: { color: '#FFFFFF', backgroundColor: 'transparent', textShadow: 'none', border: 'none' } 
  },
  { 
    id: 'shadow', 
    label: 'Soft Shadow', 
    style: { color: '#FFFFFF', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } 
  },
  { 
    id: 'outline', 
    label: 'Outline', 
    style: { color: 'transparent', WebkitTextStroke: '1px white' } 
  },
  { 
    id: 'neon', 
    label: 'Neon Red', 
    style: { color: '#FFFFFF', textShadow: '0 0 5px #DC2626, 0 0 10px #DC2626, 0 0 20px #DC2626' } 
  },
  { 
    id: 'neon_green', 
    label: 'Neon Green', 
    style: { color: '#FFFFFF', textShadow: '0 0 5px #009746, 0 0 10px #009746, 0 0 20px #009746' } 
  },
  { 
    id: 'metal', 
    label: 'Metal', 
    style: { 
      background: 'linear-gradient(to bottom, #eee, #999)', 
      WebkitBackgroundClip: 'text', 
      WebkitTextFillColor: 'transparent', 
      textShadow: '0px 1px 0px rgba(255,255,255,0.5)' 
    } 
  },
  { 
    id: 'glass', 
    label: 'Glass Box', 
    style: { 
      color: '#FFFFFF',
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(8px)', 
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      padding: '0.2em 0.5em'
    } 
  },
  { 
    id: 'dark_box', 
    label: 'Dark Box', 
    style: { 
      color: '#FFFFFF',
      backgroundColor: '#000000',
      padding: '0.2em 0.5em'
    } 
  },
  { 
    id: 'brand_box', 
    label: 'Brand', 
    style: { 
      color: '#FFFFFF',
      backgroundColor: '#009746',
      padding: '0.2em 0.5em'
    } 
  },
];

interface CanvasElement {
  id: number;
  type: 'text' | 'sticker' | 'image' | 'shape';
  name: string;
  content: string;
  x: number;
  y: number;
  width: number; 
  height: number; 
  rotation: number;
  scale: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  // Typography & Style
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number; 
  uppercase?: boolean;
  stylePreset?: string; // ID of TEXT_STYLES
  customStyle?: React.CSSProperties; // Merged styles
  zIndex: number;
  padding?: string;
  borderRadius?: string;
  border?: string;
}

const CreativeStudioModal: React.FC<CreativeStudioModalProps> = ({ onClose, onSave, initialImage, aspectRatio = '4/5' }) => {
  const { addPost } = useContent(); // Access Global Content State
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [activeTool, setActiveTool] = useState<'layout' | 'text' | 'assets' | 'upload'>('layout');
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'layers'>('properties');
  const [backgroundColor, setBackgroundColor] = useState('#0F172A');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [history, setHistory] = useState<CanvasElement[][]>([]); 
  
  // Interaction State (Multi-touch)
  const evCache = useRef<React.PointerEvent[]>([]);
  const prevDiff = useRef<number>(-1);
  const prevAngle = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'move' | 'handle'>('move');
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  
  const activeElement = elements.find(el => el.id === selectedId);

  // Initialize
  useEffect(() => {
    if (initialImage) {
        addElement('image', initialImage, { width: 100, height: 100, x: 50, y: 50, zIndex: 0, name: 'Background Image', locked: true });
    }
  }, [initialImage]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) deleteElement(selectedId);
      }
      if (e.key === 'Escape') setSelectedId(null);
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') handleUndo();
      
      // Nudging
      if (!selectedId || !activeElement) return;
      const nudgeAmount = e.shiftKey ? 5 : 0.5;
      
      if (e.key === 'ArrowUp') updateElement(selectedId, { y: activeElement.y - nudgeAmount });
      if (e.key === 'ArrowDown') updateElement(selectedId, { y: activeElement.y + nudgeAmount });
      if (e.key === 'ArrowLeft') updateElement(selectedId, { x: activeElement.x - nudgeAmount });
      if (e.key === 'ArrowRight') updateElement(selectedId, { x: activeElement.x + nudgeAmount });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, activeElement, elements, history]);

  // --- ACTIONS ---

  const saveHistory = () => {
    const newHistory = [...history, elements];
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setElements(previous);
      setHistory(history.slice(0, -1));
      setSelectedId(null);
    }
  };

  const addElement = (type: CanvasElement['type'], content: string, overrides: Partial<CanvasElement> = {}) => {
    saveHistory();
    const newId = Date.now();
    const baseElement: CanvasElement = {
      id: newId,
      type,
      name: overrides.name || `${type} ${elements.length + 1}`,
      content,
      x: 50,
      y: 50,
      width: type === 'text' ? 60 : 30, 
      height: type === 'text' ? 15 : 30,
      rotation: 0,
      scale: 1,
      opacity: 1,
      zIndex: elements.length + 1,
      locked: false,
      visible: true,
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      fontFamily: 'Outfit, sans-serif',
      fontWeight: '800',
      fontSize: 2,
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      uppercase: false,
      padding: '0px',
      borderRadius: '0px',
      customStyle: {},
      ...overrides
    };

    setElements(prev => [...prev, baseElement]);
    setSelectedId(newId);
    
    // Auto-switch tabs based on action
    if (type === 'text') setActiveTool('text');
    setRightPanelTab('properties');
  };

  const updateElement = (id: number, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const duplicateElement = (id: number) => {
    const el = elements.find(e => e.id === id);
    if (el) {
        addElement(el.type, el.content, { 
            ...el, 
            id: undefined, // Create new ID
            x: el.x + 5, 
            y: el.y + 5,
            name: `${el.name} (Copy)`
        });
    }
  };

  const deleteElement = (id: number) => {
      saveHistory();
      setElements(prev => prev.filter(e => e.id !== id));
      setSelectedId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) addElement('image', ev.target.result as string, { name: 'Uploaded Image' });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addNewsTemplate = (templateId: string) => {
    const template = NEWS_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    if (template.id === 'breaking') {
        addElement('shape', '', { width: 100, height: 15, x: 50, y: 10, backgroundColor: template.style.bg, name: 'Banner Red' });
        addElement('text', template.style.text, { y: 10, width: 90, fontSize: 2.5, uppercase: true, fontWeight: '900', name: 'Header Text' });
        addElement('text', template.style.sub, { y: 18, fontSize: 1, backgroundColor: '#000', color: '#fff', name: 'Sub Text', padding: '0.2em 0.5em' });
    } else if (template.id === 'ticker') {
        addElement('shape', '', { width: 100, height: 12, x: 50, y: 94, backgroundColor: template.style.bg, name: 'Footer Banner' });
        addElement('text', template.style.text, { y: 94, width: 95, fontSize: 1.2, textAlign: 'left', color: '#000', name: 'Ticker Text' });
    } else if (template.id === 'quote') {
        addElement('text', template.style.text, { y: 50, width: 80, fontSize: 2, fontFamily: 'Playfair Display, serif', customStyle: { textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }, name: 'Quote Text' });
        addElement('text', template.style.sub, { y: 65, fontSize: 1, fontWeight: '400', name: 'Author' });
    }
  };

  // --- POINTER EVENTS (MULTI-TOUCH LOGIC) ---

  const handlePointerDown = (e: React.PointerEvent, id: number | null, handleType?: string) => {
    if (!id && !handleType) {
        // Clicked on empty space
        setSelectedId(null);
        return;
    }

    const el = elements.find(el => el.id === id);
    if (el?.locked) return;

    // e.preventDefault(); // Sometimes prevents input focus, careful
    e.stopPropagation();
    
    // Add to cache for multi-touch
    evCache.current.push(e);
    
    setSelectedId(id);
    setRightPanelTab('properties');
    
    if (handleType) {
        setInteractionMode('handle');
        setActiveHandle(handleType);
    } else {
        setInteractionMode('move');
        setIsDragging(true);
    }

    // Important: Capture pointer for tracking outside element bounds
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selectedId || !activeElement || !canvasRef.current) return;
    
    // Find this event in the cache and update its record
    const index = evCache.current.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
    if (index > -1) {
        evCache.current[index] = e;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();

    // 1. PINCH ZOOM / ROTATE (Two Pointers)
    if (evCache.current.length === 2) {
        const ev1 = evCache.current[0];
        const ev2 = evCache.current[1];

        // Calculate distance for Zoom
        const curDiff = Math.sqrt(
            Math.pow(ev1.clientX - ev2.clientX, 2) + Math.pow(ev1.clientY - ev2.clientY, 2)
        );

        // Calculate angle for Rotation (radians -> degrees)
        const angleRad = Math.atan2(ev2.clientY - ev1.clientY, ev2.clientX - ev1.clientX);
        const angleDeg = angleRad * (180 / Math.PI);

        if (prevDiff.current > 0) {
            // SCALE LOGIC
            const scaleDiff = (curDiff - prevDiff.current) * 0.005;
            const newScale = Math.max(0.2, (activeElement.scale || 1) + scaleDiff);
            
            // ROTATION LOGIC
            // We compare current angle vs previous angle to get the delta
            let angleDelta = angleDeg - prevAngle.current;
            
            // Handle wrap-around issues (e.g. 359 -> 1)
            if (angleDelta > 180) angleDelta -= 360;
            if (angleDelta < -180) angleDelta += 360;

            updateElement(selectedId, { 
                scale: newScale,
                rotation: (activeElement.rotation || 0) + angleDelta
            });
        }
        
        prevDiff.current = curDiff;
        prevAngle.current = angleDeg;
        return; // Skip single pointer logic
    }

    // 2. SINGLE POINTER DRAG / HANDLE
    if (evCache.current.length === 1 && isDragging) {
        // Dragging Element
        if (interactionMode === 'move') {
            const movementX = e.movementX;
            const movementY = e.movementY;
            
            // Convert pixels to percentage based on canvas size
            const deltaXPercent = (movementX / canvasRect.width) * 100;
            const deltaYPercent = (movementY / canvasRect.height) * 100;

            updateElement(selectedId, {
                x: activeElement.x + deltaXPercent,
                y: activeElement.y + deltaYPercent
            });
        } 
        // Scaling via Handle (Desktop style)
        else if (interactionMode === 'handle' && activeHandle) {
             // Handle logic (e.g. 'se' = bottom-right)
             const scaleFactor = e.movementY * 0.01;
             
             if (activeHandle === 'rotate') {
                 updateElement(selectedId, { rotation: activeElement.rotation + e.movementX });
             } else {
                 updateElement(selectedId, { scale: Math.max(0.2, activeElement.scale + scaleFactor) });
             }
        }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // Remove from cache
    const index = evCache.current.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
    if (index > -1) {
        evCache.current.splice(index, 1);
    }

    // Reset multi-touch tracking if less than 2 fingers
    if (evCache.current.length < 2) {
        prevDiff.current = -1;
        prevAngle.current = 0;
    }

    setIsDragging(false);
    setActiveHandle(null);
    saveHistory(); 
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleFinish = async () => {
    setIsPublishing(true);
    
    // 1. Get Current User for Post Authoring
    const session = await SovereignBackend.verifySession();
    const user = session?.user;

    // 2. Prepare Content from Canvas
    // Gather all text elements to be used as the post "Caption" or description
    const textContent = elements
        .filter(e => e.type === 'text' || e.type === 'sticker')
        .map(e => e.content)
        .join('\n');
    
    // Fallback Visual (if render fails or for preview)
    const visual = elements.find(e => e.type === 'image')?.content || initialImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe';

    // 3. Create Studio Design Object (The Fix!)
    const studioDesignPayload = {
       elements: elements,
       backgroundColor: backgroundColor,
       aspectRatio: aspectRatio || '4/5'
    };

    setTimeout(() => {
        // 4. Publish to Global Feed
        addPost({
            id: `studio-post-${Date.now()}`,
            user: {
                name: user?.name || 'Anonymous Creator',
                handle: user ? `@${user.name.replace(/\s+/g, '').toLowerCase()}` : '@guest',
                avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                isVerified: user?.isVerified,
                reputationLabel: 'Digital Creator'
            },
            content: {
                text: textContent || '✨ Created with GIM Studio',
                media: [visual], 
                mediaType: 'image',
                contextNote: 'GIM Studio Export',
                studioDesign: studioDesignPayload // Inject full design data
            },
            stats: { likes: 0, comments: 0, shares: 0 },
            timestamp: 'Just now',
            distribution: { phase: 'incubating', healthScore: 100 },
            algoContext: { reason: 'civil_trust', label: 'Studio Design' },
            isOfficial: false
        });

        if (onSave) onSave(visual); // Fallback callback
        
        setIsPublishing(false);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950 animate-fade-in overflow-hidden">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-slate-950 border-b border-slate-800 flex justify-between items-center px-4 z-50">
         <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
               <X size={20} />
            </button>
            <div className="flex items-center gap-2">
               <Monitor size={16} className="text-brand-green" />
               <span className="text-sm font-bold text-white tracking-wide">GIM STUDIO</span>
            </div>
            <div className="w-px h-6 bg-slate-800 mx-2"></div>
            <button onClick={handleUndo} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Undo (Ctrl+Z)">
               <Undo size={18} />
            </button>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500 font-mono mr-4">
               <span className="px-1.5 py-0.5 border border-slate-800 rounded">2 Fingers</span> to Scale/Rotate
            </div>
            <button onClick={handleFinish} disabled={isPublishing} className="bg-brand-green text-white font-bold px-6 py-1.5 rounded-full flex items-center gap-2 hover:bg-green-600 transition-all shadow-[0_0_15px_rgba(0,151,70,0.3)]">
               {isPublishing ? <RotateCw size={16} className="animate-spin" /> : <Download size={16} />}
               <span className="text-xs">{isPublishing ? 'Publishing...' : 'Export to Feed'}</span>
            </button>
         </div>
      </div>

      {/* WORKSPACE */}
      <div className="absolute top-14 bottom-0 left-0 right-0 flex">
         
         {/* 1. LEFT TOOLBAR */}
         <div className="w-16 md:w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-6 z-40">
            {[
               { id: 'layout', icon: Layout, label: 'Layout' },
               { id: 'text', icon: Type, label: 'Text' },
               { id: 'assets', icon: Grid, label: 'Assets' },
               { id: 'upload', icon: Upload, label: 'Upload' },
            ].map(tool => (
               <button 
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id as any); if(tool.id === 'upload') fileInputRef.current?.click(); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full relative ${activeTool === tool.id ? 'text-brand-green' : 'text-slate-500 hover:text-slate-300'}`}
               >
                  <tool.icon size={24} strokeWidth={activeTool === tool.id ? 2.5 : 2} />
                  <span className="text-[9px] font-bold">{tool.label}</span>
                  {activeTool === tool.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-green rounded-l-full"></div>}
               </button>
            ))}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
         </div>

         {/* 2. SUB-TOOLBAR (CONTEXTUAL) */}
         <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
            <div className="p-4 border-b border-slate-800">
               <h3 className="text-white font-bold text-sm uppercase tracking-wider">{activeTool}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               {activeTool === 'layout' && (
                  <div className="space-y-6">
                     <div>
                        <label className="text-xs font-bold text-slate-500 mb-3 block">Templates</label>
                        <div className="space-y-2">
                           {NEWS_TEMPLATES.map(t => (
                              <button key={t.id} onClick={() => addNewsTemplate(t.id)} className="w-full text-left bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-brand-green transition-colors group">
                                 <div className="h-1.5 w-8 rounded-full mb-2" style={{background: t.style.bg}}></div>
                                 <span className="text-xs font-bold text-slate-300 group-hover:text-white">{t.label}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 mb-3 block">Background</label>
                        <div className="grid grid-cols-4 gap-2">
                           {['#0F172A', '#000000', '#FFFFFF', '#DC2626', '#2563EB', '#F59E0B', '#10B981'].map(c => (
                              <button key={c} onClick={() => setBackgroundColor(c)} className="w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform" style={{backgroundColor: c}} />
                           ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           {BRAND_GRADIENTS.map(g => (
                              <button key={g.id} onClick={() => setBackgroundColor(g.value)} className="h-8 rounded-md border border-white/10 hover:border-white/30" style={{background: g.value}} title={g.label} />
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeTool === 'text' && (
                  <div className="space-y-3">
                     <button onClick={() => addElement('text', 'HEADLINE')} className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-black text-xl hover:border-brand-green transition-all">
                        Heading
                     </button>
                     <button onClick={() => addElement('text', 'Subheading text', { fontSize: 1.5, fontWeight: '600' })} className="w-full py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-bold text-sm hover:border-brand-green transition-all">
                        Subheading
                     </button>
                     <button onClick={() => addElement('text', 'Body text goes here', { fontSize: 1, fontWeight: '400' })} className="w-full py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 text-xs hover:border-brand-green transition-all">
                        Body Text
                     </button>
                  </div>
               )}

               {activeTool === 'assets' && (
                  <div className="space-y-6">
                     {/* Smart Stickers */}
                     <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Smart Widgets</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => addElement('sticker', '🔴 LIVE', { backgroundColor: '#DC2626', color: '#fff', fontSize: 1, padding: '0.2em 0.5em', borderRadius: '4px' })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-brand-green flex flex-col items-center gap-2">
                              <Zap size={20} className="text-red-500" />
                              <span className="text-[10px] text-white">Live</span>
                           </button>
                           <button onClick={() => addElement('text', new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), { fontSize: 1, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '4px', color: '#fff' })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-brand-green flex flex-col items-center gap-2">
                              <Clock size={20} className="text-brand-green" />
                              <span className="text-[10px] text-white">Time</span>
                           </button>
                           <button onClick={() => addElement('text', '📍 Casablanca', { fontSize: 1, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '0.2em 0.8em' })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-brand-green flex flex-col items-center gap-2">
                              <MapPin size={20} className="text-brand-yellow" />
                              <span className="text-[10px] text-white">Location</span>
                           </button>
                        </div>
                     </div>

                     {/* Shapes */}
                     <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Shapes</h4>
                        <div className="grid grid-cols-3 gap-2">
                           <button onClick={() => addElement('shape', '', { backgroundColor: '#ffffff', width: 30, height: 30, borderRadius: '50%' })} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 flex justify-center"><Circle size={20} className="text-white" /></button>
                           <button onClick={() => addElement('shape', '', { backgroundColor: '#ffffff', width: 30, height: 30, borderRadius: '4px' })} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 flex justify-center"><Square size={20} className="text-white" /></button>
                           <button onClick={() => addElement('shape', '', { backgroundColor: '#ffffff', width: 30, height: 30, borderRadius: '0px' })} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 flex justify-center"><Triangle size={20} className="text-white" /></button>
                        </div>
                     </div>

                     {/* Badges */}
                     <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Official Badges</h4>
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => addElement('sticker', '✓ Verified', { backgroundColor: '#009746', color: '#fff', borderRadius: '50px', padding: '0.3em 0.8em' })} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 flex items-center justify-center gap-1">
                              <Check size={14} className="text-brand-green" />
                              <span className="text-[10px] text-white">Verified</span>
                           </button>
                           <button onClick={() => addElement('sticker', '★ Top Rated', { backgroundColor: '#FFD100', color: '#000', borderRadius: '50px', padding: '0.3em 0.8em' })} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 flex items-center justify-center gap-1">
                              <Star size={14} className="text-brand-yellow" />
                              <span className="text-[10px] text-white">Rated</span>
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* 3. CENTER CANVAS */}
         <div 
            className="flex-1 bg-[#090f1a] relative overflow-hidden flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5"
            onPointerDown={(e) => handlePointerDown(e, null)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }} // Crucial for gestures
         >
            <div 
               ref={canvasRef}
               className="shadow-2xl relative transition-all select-none ring-1 ring-slate-800"
               style={{ 
                  width: 'min(100%, 500px)', 
                  aspectRatio: aspectRatio, 
                  background: backgroundColor,
                  overflow: 'hidden'
               }}
            >
               {elements.filter(e => e.visible).sort((a,b) => a.zIndex - b.zIndex).map(el => {
                  const isSelected = selectedId === el.id;
                  
                  return (
                     <div
                        key={el.id}
                        onPointerDown={(e) => handlePointerDown(e, el.id)}
                        className={`absolute flex items-center justify-center cursor-move ${isSelected ? 'z-[100]' : ''}`}
                        style={{
                           left: `${el.x}%`,
                           top: `${el.y}%`,
                           width: el.type === 'text' ? 'auto' : `${el.width}%`,
                           height: el.type === 'shape' ? `${el.height}%` : 'auto',
                           transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`,
                           opacity: el.opacity,
                           zIndex: el.zIndex,
                           pointerEvents: el.locked ? 'none' : 'auto'
                        }}
                     >
                        {/* Element Content */}
                        {el.type === 'text' || el.type === 'sticker' ? (
                           <div 
                              style={{ 
                                 color: el.color, 
                                 backgroundColor: el.backgroundColor,
                                 backgroundImage: el.backgroundImage,
                                 fontFamily: el.fontFamily, 
                                 fontWeight: el.fontWeight,
                                 fontSize: `${el.fontSize}rem`,
                                 textAlign: el.textAlign,
                                 letterSpacing: `${el.letterSpacing}px`,
                                 lineHeight: el.lineHeight,
                                 textTransform: el.uppercase ? 'uppercase' : 'none',
                                 padding: el.padding,
                                 borderRadius: el.borderRadius,
                                 border: el.border,
                                 minWidth: '20px',
                                 whiteSpace: 'pre-wrap',
                                 ...el.customStyle // Applies shadows, filters, text-stroke
                              }}
                           >
                              {el.content}
                           </div>
                        ) : el.type === 'image' ? (
                           <img src={el.content} className="w-full h-auto pointer-events-none" alt="" />
                        ) : el.type === 'shape' ? (
                           <div style={{ width: '100%', height: '100%', backgroundColor: el.backgroundColor, borderRadius: el.borderRadius }}></div>
                        ) : (
                           <div style={{ fontSize: `${el.fontSize}rem` }}>{el.content}</div>
                        )}

                        {/* Selection UI */}
                        {isSelected && !el.locked && (
                           <div className="absolute inset-0 border-2 border-brand-green pointer-events-none -m-1">
                              <div 
                                className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md cursor-grab pointer-events-auto active:cursor-grabbing text-slate-900" 
                                onPointerDown={(e) => handlePointerDown(e, el.id, 'rotate')}
                              >
                                 <RotateCw size={14} />
                              </div>
                              <div 
                                className="absolute -bottom-3 -right-3 w-8 h-8 bg-brand-green rounded-full shadow-md cursor-nwse-resize pointer-events-auto flex items-center justify-center text-white" 
                                onPointerDown={(e) => handlePointerDown(e, el.id, 'scale')}
                              >
                                 <Maximize2 size={14} />
                              </div>
                           </div>
                        )}
                        {/* Lock Indicator */}
                        {el.locked && (
                           <div className="absolute top-0 right-0 p-1 bg-black/50 rounded-bl-lg text-white/50">
                              <Lock size={10} />
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* 4. RIGHT SIDEBAR (LAYERS & PROPERTIES) */}
         <div className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col z-30">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
               <button 
                  onClick={() => setRightPanelTab('properties')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${rightPanelTab === 'properties' ? 'text-brand-green border-b-2 border-brand-green' : 'text-slate-500 hover:text-white'}`}
               >
                  Properties
               </button>
               <button 
                  onClick={() => setRightPanelTab('layers')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${rightPanelTab === 'layers' ? 'text-brand-green border-b-2 border-brand-green' : 'text-slate-500 hover:text-white'}`}
               >
                  Layers
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               
               {/* --- PROPERTIES --- */}
               {rightPanelTab === 'properties' && (
                  <div className="space-y-6">
                     {!selectedId ? (
                        <div className="text-center py-10 text-slate-500">
                           <p className="text-xs">Select an element to edit properties.</p>
                        </div>
                     ) : activeElement ? (
                        <>
                           {/* Quick Actions */}
                           <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                              <h3 className="text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                                 <Sliders size={14} /> {activeElement.type}
                              </h3>
                              <div className="flex gap-2">
                                 <button onClick={() => updateElement(activeElement.id, { locked: !activeElement.locked })} className={`p-1.5 rounded hover:bg-slate-800 ${activeElement.locked ? 'text-brand-yellow' : 'text-slate-400'}`}>
                                    {activeElement.locked ? <Lock size={14} /> : <Unlock size={14} />}
                                 </button>
                                 <button onClick={() => duplicateElement(activeElement.id)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400">
                                    <Copy size={14} />
                                 </button>
                                 <button onClick={() => deleteElement(activeElement.id)} className="p-1.5 rounded hover:bg-red-900/50 text-red-500">
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </div>

                           {/* Alignment */}
                           <div>
                              <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Alignment</label>
                              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                                 <button onClick={() => updateElement(activeElement.id, { x: 50 })} className="flex-1 py-1 text-slate-400 hover:text-white" title="Center Horizontal"><AlignCenterHorizontal size={16} /></button>
                                 <button onClick={() => updateElement(activeElement.id, { y: 50 })} className="flex-1 py-1 text-slate-400 hover:text-white" title="Center Vertical"><AlignCenterVertical size={16} /></button>
                              </div>
                           </div>

                           {/* Text Specifics */}
                           {(activeElement.type === 'text' || activeElement.type === 'sticker') && (
                              <div className="space-y-4">
                                 <textarea 
                                    value={activeElement.content} 
                                    onChange={(e) => updateElement(activeElement.id, { content: e.target.value })} 
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-brand-green outline-none resize-none"
                                    rows={2}
                                 />
                                 
                                 <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Font</label>
                                    <div className="grid grid-cols-2 gap-2">
                                       {FONTS.map(f => (
                                          <button key={f.id} onClick={() => updateElement(activeElement.id, { fontFamily: f.family, fontWeight: f.weight })} className={`p-2 rounded-lg text-xs border truncate ${activeElement.fontFamily === f.family ? 'bg-brand-green text-white border-brand-green' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                                             {f.name}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 {/* TYPOGRAPHY CONTROLS */}
                                 <div className="space-y-3">
                                    <label className="text-xs text-slate-500 font-bold uppercase block">Typography</label>
                                    
                                    {/* Size & Align */}
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <span className="text-[10px] text-slate-400 mb-1 block">Size</span>
                                            <input 
                                                type="number" 
                                                value={activeElement.fontSize} 
                                                onChange={(e) => updateElement(activeElement.id, { fontSize: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs focus:border-brand-green outline-none"
                                            />
                                        </div>
                                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 self-end">
                                            {['left', 'center', 'right'].map((align) => (
                                                <button 
                                                    key={align}
                                                    onClick={() => updateElement(activeElement.id, { textAlign: align as any })}
                                                    className={`p-2 rounded hover:bg-slate-800 ${activeElement.textAlign === align ? 'text-brand-green bg-slate-800' : 'text-slate-400'}`}
                                                >
                                                    {align === 'left' && <AlignLeft size={14} />}
                                                    {align === 'center' && <AlignCenter size={14} />}
                                                    {align === 'right' && <AlignRight size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Style Toggles */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateElement(activeElement.id, { fontWeight: activeElement.fontWeight === '800' ? '400' : '800' })}
                                            className={`flex-1 py-2 rounded-lg border text-xs font-bold flex items-center justify-center ${activeElement.fontWeight === '800' ? 'bg-slate-800 text-white border-slate-700' : 'bg-transparent text-slate-500 border-slate-800'}`}
                                        >
                                            <Bold size={14} />
                                        </button>
                                        <button 
                                            onClick={() => updateElement(activeElement.id, { uppercase: !activeElement.uppercase })}
                                            className={`flex-1 py-2 rounded-lg border text-xs font-bold ${activeElement.uppercase ? 'bg-slate-800 text-white border-slate-700' : 'bg-transparent text-slate-500 border-slate-800'}`}
                                        >
                                            AA
                                        </button>
                                    </div>

                                    {/* Spacing */}
                                    <div className="space-y-2 pt-2">
                                        <div>
                                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                <span>Letter Spacing</span>
                                                <span>{activeElement.letterSpacing}px</span>
                                            </div>
                                            <input 
                                                type="range" min="-2" max="20" step="1"
                                                value={activeElement.letterSpacing || 0}
                                                onChange={(e) => updateElement(activeElement.id, { letterSpacing: Number(e.target.value) })}
                                                className="w-full accent-brand-green bg-slate-800 h-1 rounded-full appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                <span>Line Height</span>
                                                <span>{activeElement.lineHeight}</span>
                                            </div>
                                            <input 
                                                type="range" min="0.8" max="2" step="0.1"
                                                value={activeElement.lineHeight || 1.2}
                                                onChange={(e) => updateElement(activeElement.id, { lineHeight: Number(e.target.value) })}
                                                className="w-full accent-brand-green bg-slate-800 h-1 rounded-full appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                 </div>

                                 <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-2 block flex items-center gap-2">
                                      <Palette size={14} /> Effect Style
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                       {TEXT_STYLES.map(style => (
                                          <button 
                                             key={style.id} 
                                             onClick={() => updateElement(activeElement.id, { 
                                                stylePreset: style.id,
                                                customStyle: style.style,
                                                color: style.style.color || activeElement.color,
                                                backgroundColor: style.style.backgroundColor || 'transparent'
                                             })}
                                             className={`h-10 rounded-lg border text-[10px] font-bold overflow-hidden transition-all ${activeElement.stylePreset === style.id ? 'border-brand-green bg-slate-800 text-white' : 'border-slate-800 text-slate-400 hover:bg-slate-900'}`}
                                          >
                                             {style.label}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* Shape Specifics */}
                           {activeElement.type === 'shape' && (
                              <div>
                                 <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Color</label>
                                 <div className="grid grid-cols-5 gap-2">
                                    {['#ffffff', '#000000', '#009746', '#FFD100', '#DC2626'].map(c => (
                                       <button 
                                          key={c}
                                          onClick={() => updateElement(activeElement.id, { backgroundColor: c })}
                                          className="w-8 h-8 rounded border border-white/20"
                                          style={{ backgroundColor: c }}
                                       />
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Opacity */}
                           <div className="space-y-2">
                              <label className="text-xs text-slate-500 font-bold uppercase mb-2 block flex justify-between">
                                 <span>Opacity</span> <span>{Math.round(activeElement.opacity * 100)}%</span>
                              </label>
                              <input 
                                 type="range" min="0" max="1" step="0.1" 
                                 value={activeElement.opacity} 
                                 onChange={(e) => updateElement(activeElement.id, { opacity: parseFloat(e.target.value) })}
                                 className="w-full accent-brand-green bg-slate-800 h-1.5 rounded-full appearance-none cursor-pointer"
                              />
                           </div>
                        </>
                     ) : null}
                  </div>
               )}

               {/* --- LAYERS --- */}
               {rightPanelTab === 'layers' && (
                  <div className="space-y-2">
                     {elements.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No elements yet.</p>}
                     
                     {[...elements].reverse().map(el => (
                        <div 
                           key={el.id} 
                           onClick={() => setSelectedId(el.id)}
                           className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${el.id === selectedId ? 'bg-slate-800 border-brand-green' : 'bg-transparent border-slate-800 hover:bg-slate-900'}`}
                        >
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-white truncate max-w-[100px]">{el.name || el.type}</span>
                           </div>
                           <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { visible: !el.visible }); }} className="hover:text-white">
                                 {el.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }} className="hover:text-white">
                                 {el.locked ? <Lock size={14} className="text-brand-yellow" /> : <Unlock size={14} />}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { zIndex: el.zIndex + 1 }); }} className="hover:text-white">
                                 <ArrowUp size={14} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { zIndex: el.zIndex - 1 }); }} className="hover:text-white">
                                 <ArrowDown size={14} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

            </div>
         </div>

      </div>
    </div>
  );
};

export default CreativeStudioModal;
