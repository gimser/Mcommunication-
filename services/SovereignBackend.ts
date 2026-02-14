
// Mock Sovereign Backend Service (Government Tech Simulation)
// Simulates secure infrastructure with atomic transactions and role separation.

export interface UserSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'citizen' | 'professional' | 'admin';
    profileId?: string; 
    isVerified?: boolean;
    avatar?: string; // Added avatar to user root for easy access
    // Expanded Profile Details
    profile?: ProfileEntity; 
  };
  expiresAt: number;
}

export interface IdentityToken {
  token: string;
  qrPayload: string;
  expiresAt: number;
}

// SIMULATED DATABASE TABLES
interface UserEntity {
  id: string;
  email: string;
  passwordHash: string; 
  role: 'citizen' | 'professional';
  createdAt: string;
}

export interface ProfileEntity {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  trade?: string; // Only for pros
  karnScore: number; // Reputation
  isVerified: boolean;
  avatar?: string; // Persist avatar here
  cover?: string; // Persist cover here
  gallery?: string[]; // Portfolio
}

const DB_USERS: UserEntity[] = [];
const DB_PROFILES: ProfileEntity[] = [];
const STORAGE_KEY = 'mcom_gov_session_v3';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SovereignBackend = {
  
  /**
   * ATOMIC TRANSACTION: Register Maâlem (User + Profile)
   */
  async registerMaalem(credentials: { email: string; password: string }, profileData: any): Promise<UserSession> {
    console.log(`[Backend] Transaction Start: Registering ${credentials.email}`);
    await delay(1500); 

    if (DB_USERS.find(u => u.email === credentials.email)) {
      throw new Error("Identity already exists in National Registry.");
    }

    try {
      // 1. Create Identity
      const userId = `USR-${Math.floor(Math.random() * 1000000)}`;
      const newUser: UserEntity = {
        id: userId,
        email: credentials.email,
        passwordHash: btoa(credentials.password),
        role: profileData.trade === 'Client' ? 'citizen' : 'professional',
        createdAt: new Date().toISOString()
      };

      // 2. Create Professional Record (The "Karné")
      const profileId = `PROF-${Math.floor(Math.random() * 1000000)}`;
      const newProfile: ProfileEntity = {
        id: profileId,
        userId: userId,
        fullName: profileData.name,
        phone: profileData.phone,
        city: profileData.city,
        trade: profileData.trade,
        karnScore: 50, // Start neutral
        isVerified: profileData.isVerified || false,
        gallery: profileData.gallery || [],
        avatar: profileData.avatar,
        cover: profileData.cover
      };

      // Commit
      DB_USERS.push(newUser);
      DB_PROFILES.push(newProfile);

      return this.createSession(newUser, newProfile);

    } catch (error) {
      console.error("Transaction Rollback", error);
      throw new Error("Registration failed. Data integrity rollback executed.");
    }
  },

  async login(email: string, password?: string): Promise<UserSession> {
    await delay(1000);
    const user = DB_USERS.find(u => u.email === email);
    
    // For demo purposes, if user doesn't exist in array, simulate a successful login for 'demo' users
    if (!user) {
        if (email === 'maalem@demo.com') {
            return this.createSession({
                id: 'demo-maalem', email, passwordHash: '', role: 'professional', createdAt: ''
            }, {
                id: 'p-1', userId: 'demo-maalem', fullName: 'Abdelkader Najar', phone: '06000000', city: 'Casablanca', trade: 'Carpenter', karnScore: 85, isVerified: true, gallery: [], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            });
        }
        if (email === 'client@demo.com') {
             return this.createSession({
                id: 'demo-client', email, passwordHash: '', role: 'citizen', createdAt: ''
            }, {
                id: 'c-1', userId: 'demo-client', fullName: 'Sarah Client', phone: '06000000', city: 'Casablanca', trade: 'Client', karnScore: 100, isVerified: true, gallery: [], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
            });
        }
        throw new Error("Identity record not found.");
    }

    const profile = DB_PROFILES.find(p => p.userId === user.id);
    return this.createSession(user, profile);
  },

  createSession(user: UserEntity, profile?: ProfileEntity): UserSession {
    const session: UserSession = {
      token: `gov.token.${Date.now()}`,
      user: {
        id: user.id,
        name: profile?.fullName || user.email,
        email: user.email,
        role: user.role,
        profileId: profile?.id,
        isVerified: profile?.isVerified,
        avatar: profile?.avatar,
        profile: profile // Inject full profile data
      },
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async verifySession(): Promise<UserSession | null> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  },

  async updateProfile(userId: string, updates: Partial<ProfileEntity>): Promise<UserSession | null> {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const session: UserSession = JSON.parse(stored);
      if (session.user.id !== userId) return null; // Security check

      // Update Session Data
      if (session.user.profile) {
          session.user.profile = { ...session.user.profile, ...updates };
      }
      
      // Update Root User Data shortcuts
      if (updates.fullName) session.user.name = updates.fullName;
      if (updates.avatar) session.user.avatar = updates.avatar;

      // Persist
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  },

  async loginWithProvider(provider: string, data: any): Promise<UserSession> {
      await delay(800);
      // Mock Social Login handling
      const mockUser: UserEntity = {
          id: `SOC-${Date.now()}`,
          email: data.email,
          passwordHash: 'oauth',
          role: 'citizen', // Default to citizen for social
          createdAt: new Date().toISOString()
      };
      return this.createSession(mockUser);
  },
  
  // Legacy support
  issueZeroTrustToken: async (context?: string): Promise<IdentityToken> => ({ token: 'mock', qrPayload: 'mock', expiresAt: Date.now() + 10000 })
};
