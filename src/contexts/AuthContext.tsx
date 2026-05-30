import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type OAuthProvider = 'google' | 'github' | 'linkedin' | 'email';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  provider: OAuthProvider;
}

interface AuthContextType {
  user: User | null;
  login: (provider: OAuthProvider, email?: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'resumebugs_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch { /* corrupted data — ignore */ }
  }, []);

  /**
   * Returns a Promise so the caller can await the result
   * and show a success state BEFORE the modal closes.
   */
  const login = async (provider: OAuthProvider, email?: string, _password?: string) => {
    let newUser: User;

    if (provider === 'email' && email) {
      const name = email
        .split('@')[0]
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
      newUser = { name: name || 'User', email, provider };
    } else {
      const names: Record<OAuthProvider, string> = {
        google: 'Alex Johnson',
        github: 'DevCoder',
        linkedin: 'Jordan Smith',
        email: 'User',
      };
      const emails: Record<OAuthProvider, string> = {
        google: 'alex.johnson@gmail.com',
        github: 'devcoder@github.com',
        linkedin: 'jordan.smith@linkedin.com',
        email: 'user@example.com',
      };
      newUser = { name: names[provider], email: emails[provider], provider };
    }

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    // NOTE: we do NOT close the modal here — the LoginModal component
    // decides when to close (after showing the success screen).
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoginOpen,
        openLogin: () => setIsLoginOpen(true),
        closeLogin: () => setIsLoginOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

