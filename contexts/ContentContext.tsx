
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PostProps } from '../components/PostCard';

export type JobStatus = 'idle' | 'searching' | 'offered' | 'accepted' | 'arrived' | 'working' | 'completed' | 'rated';

export interface Offer {
  id: string;
  proName: string;
  proAvatar: string;
  price: number;
  duration: string;
  warranty?: string;
  rating: number;
  jobsDone: number;
  badges: string[];
  note: string;
  isTrusted: boolean;
  portfolioPreview?: string[];
}

export interface ActiveJob {
  id: string;
  clientName: string;
  clientLocation: string;
  serviceType: string;
  urgency: 'normal' | 'urgent';
  price: number;
  status: JobStatus;
  escrowSecured?: boolean; 
  provider?: {
    name: string;
    avatar: string;
    rating: number;
    distance: string;
    eta: string;
    phone: string;
  };
  startTime?: number;
}

export interface ClientRequest {
  id: string;
  category: string;
  description: string;
  location: string;
  time: string;
  status: 'open' | 'closed';
  offers: Offer[];
  images?: string[];
  isEmergency?: boolean;
}

export interface DisputeVerdict {
  status: 'resolved';
  outcome: 'refund_partial' | 'refund_full' | 'dismissed';
  refundAmount?: number;
  penaltyPoints?: number;
  reason: string;
}

// Chat Contact Interface
export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  role: string;
  isVerified?: boolean;
}

interface ContentContextType {
  posts: PostProps[];
  addPost: (post: PostProps) => void;
  
  // Contacts & Chat
  contacts: ChatContact[];
  addContact: (user: any) => void;

  // Live State
  activeLive: {
    isActive: boolean;
    hostName: string;
    topic: string;
    audience: string;
  } | null;
  startLive: (hostName: string, topic: string, audience: string) => void;
  endLive: () => void;

  // Active Job State
  activeJob: ActiveJob | null;
  clientRequest: ClientRequest | null;
  
  // Dispute State
  activeVerdict: DisputeVerdict | null;
  
  requestService: (details: any) => void;
  requestDirectService: (provider: any, details: any) => void;
  acceptOffer: (offer: Offer) => void;
  acceptJob: () => void;
  acceptOpportunity: (opportunity: any) => void; // New Method for Maalem
  updateJobStatus: (status: JobStatus) => void;
  cancelJob: () => void;
  
  // New: Dispute Methods
  raiseDispute: (jobId: string, reason: string, proof: any) => void;
  clearVerdict: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const INITIAL_POSTS: PostProps[] = [];

// Initial System Contact (Only official support, no fake users)
const INITIAL_CONTACTS: ChatContact[] = [
  { 
    id: 'gov-support', 
    name: "Gov Support", 
    avatar: "https://ui-avatars.com/api/?name=Gov+Support&background=0F172A&color=fff", 
    lastMessage: "Welcome to M-Comm Secure Chat.", 
    time: "Now", 
    unread: 1, 
    isOnline: true, 
    role: "Official", 
    isVerified: true 
  }
];

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<PostProps[]>(INITIAL_POSTS);
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [activeLive, setActiveLive] = useState<ContentContextType['activeLive']>(null);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [clientRequest, setClientRequest] = useState<ClientRequest | null>(null);
  const [activeVerdict, setActiveVerdict] = useState<DisputeVerdict | null>(null);

  const addPost = (newPost: PostProps) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const addContact = (user: any) => {
    setContacts(prev => {
      // Prevent duplicates
      if (prev.find(c => c.id === user.id || c.name === user.name)) return prev;
      
      const newContact: ChatContact = {
        id: user.id || `user-${Date.now()}`,
        name: user.name,
        avatar: user.avatar,
        lastMessage: "Connected via Profile",
        time: "Just now",
        unread: 0,
        isOnline: true, // Assume online when just added
        role: user.reputationLabel || "User",
        isVerified: user.isVerified
      };
      return [newContact, ...prev];
    });
  };

  const startLive = (hostName: string, topic: string, audience: string) => {
    setActiveLive({ isActive: true, hostName, topic, audience });
  };

  const endLive = () => {
    setActiveLive(null);
  };

  // --- JOB LOGIC ---
  
  // 1. Client creates MARKET request
  const requestService = (details: any) => {
    if (details.urgency === 'urgent') {
        setActiveJob({
            id: `JOB-${Date.now()}`,
            clientName: "You",
            clientLocation: "Maârif, Casablanca",
            serviceType: details.category || "Emergency Repair",
            urgency: 'urgent',
            price: 0, 
            status: 'searching', 
            escrowSecured: false
        });

        setTimeout(() => {
            setActiveJob(prev => prev ? ({
                ...prev,
                status: 'accepted',
                price: 450, 
                escrowSecured: true,
                provider: {
                    name: "Redouane SOS",
                    avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=100",
                    rating: 4.9,
                    distance: "0.5 km",
                    eta: "8 min", 
                    phone: "0661000000"
                }
            }) : null);
        }, 4000);
        return;
    }

    setClientRequest({
      id: `REQ-${Date.now()}`,
      category: details.category || "General Repair",
      description: details.description,
      location: "Maârif, Casablanca",
      time: "Just now",
      status: 'open',
      offers: [] 
    });

    const isProject = ['paint', 'mason', 'carpenter'].includes(details.category) || details.projectScale === 'corporate';

    if (isProject) {
        setTimeout(() => {
            const offer1: Offer = {
                id: 'OFF-P1',
                proName: "Atelier Zellige Pro",
                proAvatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&q=80",
                price: 4500,
                duration: "3 Days",
                warranty: "1 Year Warranty",
                rating: 5.0,
                jobsDone: 312,
                badges: ["Top Maâlem", "Warranty"],
                note: "Full preparation, 2 coats of premium paint, and cleanup included.",
                isTrusted: true,
                portfolioPreview: [
                    "https://images.unsplash.com/photo-1562259920-47afc305f369?w=100",
                    "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=100"
                ]
            };
            setClientRequest(prev => prev ? ({...prev, offers: [...prev.offers, offer1]}) : null);
        }, 2000);
    } else {
        setTimeout(() => {
            const newOffer: Offer = {
                id: 'OFF-1',
                proName: "Maâlem Hassan",
                proAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                price: 300,
                duration: "40 min",
                rating: 4.9,
                jobsDone: 120,
                badges: ["Top Rated", "Fast"],
                note: "I am nearby. I can fix this quickly.",
                isTrusted: true
            };
            setClientRequest(prev => prev ? ({...prev, offers: [...prev.offers, newOffer]}) : null);
        }, 2500);
    }
  };

  const requestDirectService = (provider: any, details: any) => {
      setActiveJob({
          id: `JOB-DIRECT-${Date.now()}`,
          clientName: "You",
          clientLocation: "Maârif, Casablanca",
          serviceType: details.category || "Direct Hire",
          urgency: 'normal',
          price: 0, 
          status: 'searching', 
          escrowSecured: false,
          provider: {
              name: provider.name,
              avatar: provider.avatar,
              rating: parseFloat(provider.rating),
              distance: "Calculating...",
              eta: "TBD",
              phone: "0600000000"
          }
      });

      setTimeout(() => {
          setActiveJob(prev => prev ? ({
              ...prev,
              status: 'accepted',
              price: 800, 
              escrowSecured: true, 
              provider: {
                  ...prev.provider!,
                  eta: "Tomorrow, 9:00 AM",
                  distance: "3.5 km"
              }
          }) : null);
      }, 3000);
  };

  const acceptOffer = (offer: Offer) => {
      if (!clientRequest) return;
      setActiveJob({
          id: `JOB-${Date.now()}`,
          clientName: "You",
          clientLocation: clientRequest.location,
          serviceType: clientRequest.category,
          urgency: 'normal',
          price: offer.price,
          status: 'accepted',
          escrowSecured: true,
          provider: {
              name: offer.proName,
              avatar: offer.proAvatar,
              rating: offer.rating,
              distance: "1.2 km",
              eta: offer.duration,
              phone: "0600000000"
          },
          startTime: Date.now()
      });
      setClientRequest(null);
  };

  // Maalem accepts opportunity from Dashboard
  const acceptOpportunity = (opportunity: any) => {
      // Parse budget to number (e.g. "200-300 DH" -> 200)
      const parsedPrice = parseInt(opportunity.budget.split('-')[0].replace(/[^0-9]/g, '')) || 200;
      
      setActiveJob({
          id: `JOB-${opportunity.id}-${Date.now()}`,
          clientName: "Karim Client",
          clientLocation: opportunity.location,
          serviceType: opportunity.type,
          urgency: opportunity.urgent ? 'urgent' : 'normal',
          price: parsedPrice,
          status: 'accepted',
          escrowSecured: true,
          provider: {
              name: "Me", // Self
              avatar: "", 
              rating: 5.0,
              distance: "0 km",
              eta: "10 min",
              phone: "0600000000"
          },
          startTime: Date.now()
      });
  };

  const acceptJob = () => {};

  const updateJobStatus = (status: JobStatus) => {
    if (status === 'idle') {
        setActiveJob(null);
    } else {
        setActiveJob(prev => prev ? ({ ...prev, status }) : null);
    }
  };

  const cancelJob = () => {
    setActiveJob(null);
    setClientRequest(null);
  };

  // SCENARIO 3 & 6: DISPUTE LOGIC
  const raiseDispute = (jobId: string, reason: string, proof: any) => {
      console.log(`Dispute raised for ${jobId}: ${reason}`);
      
      // AI Decision Engine
      const isQualityIssue = reason === 'quality'; // From DisputeModal REASONS ID
      
      setTimeout(() => {
          let verdict: DisputeVerdict;

          if (isQualityIssue) {
              // SCENARIO 3: Unsatisfactory Work Logic
              verdict = {
                  status: 'resolved',
                  outcome: 'refund_partial',
                  refundAmount: activeJob ? Math.floor(activeJob.price * 0.3) : 0, // 30% Refund
                  penaltyPoints: 20, // Strict Penalty
                  reason: 'System Analysis: Verified evidence shows poor finishing quality. 30% refund issued + warning.'
              };
          } else {
              // Generic Dispute
              verdict = {
                  status: 'resolved',
                  outcome: 'dismissed', // Default to dismissed unless quality or fraud
                  refundAmount: 0,
                  penaltyPoints: 0,
                  reason: 'Evidence insufficient for full refund. Recommendation: Discuss with Maâlem.'
              };
          }

          setActiveVerdict(verdict);
          setActiveJob(null); // End job on dispute resolution
      }, 1000);
  };

  const clearVerdict = () => setActiveVerdict(null);

  return (
    <ContentContext.Provider value={{ 
      posts, addPost, activeLive, startLive, endLive,
      contacts, addContact,
      activeJob, clientRequest, activeVerdict, 
      requestService, requestDirectService, acceptOffer, acceptJob, acceptOpportunity, updateJobStatus, cancelJob,
      raiseDispute, clearVerdict
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
