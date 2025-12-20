
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Candidate, JobStatus, CandidateStatus, BlogPost } from './types';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy
} from 'firebase/firestore';

interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  blogPosts: BlogPost[];
  isGmailConnected: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  addJob: (job: Job) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  addCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (candidate: Candidate) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addBlogPost: (post: BlogPost) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  connectGmail: () => Promise<void>;
  disconnectGmail: () => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync Jobs
  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('postedDate', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const jobsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Job));
        setJobs(jobsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Firestore Jobs Sync Error:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync Candidates
  useEffect(() => {
    const q = query(collection(db, 'candidates'), orderBy('appliedDate', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const candidatesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Candidate));
        setCandidates(candidatesData);
      },
      (error) => {
        console.error("Firestore Candidates Sync Error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync Blog Posts
  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const blogData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
        setBlogPosts(blogData);
      },
      (error) => {
        console.error("Firestore Blog Sync Error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const addJob = async (job: Job) => {
    const { id, ...data } = job;
    await addDoc(collection(db, 'jobs'), data);
  };

  const updateJob = async (updatedJob: Job) => {
    const { id, ...data } = updatedJob;
    await updateDoc(doc(db, 'jobs', id), data);
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, 'jobs', id));
  };

  const addCandidate = async (candidate: Candidate) => {
    const { id, ...data } = candidate;
    await addDoc(collection(db, 'candidates'), data);
  };

  const updateCandidate = async (updatedCandidate: Candidate) => {
    const { id, ...data } = updatedCandidate;
    await updateDoc(doc(db, 'candidates', id), data);
  };

  const addBlogPost = async (post: BlogPost) => {
    const { id, ...data } = post;
    await addDoc(collection(db, 'blogPosts'), data);
  };

  const updateBlogPost = async (updatedPost: BlogPost) => {
    const { id, ...data } = updatedPost;
    await updateDoc(doc(db, 'blogPosts', id), data);
  };

  const deleteBlogPost = async (id: string) => {
    await deleteDoc(doc(db, 'blogPosts', id));
  };

  const connectGmail = async () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            setIsGmailConnected(true);
            resolve();
        }, 1500);
    });
  };

  const disconnectGmail = () => {
      setIsGmailConnected(false);
  };

  const login = (email: string, pass: string) => {
      if (email === 'recruitment@remotebusinesspartner.com.au' && pass === 'Foxtrot19!') {
          setIsAuthenticated(true);
          return true;
      }
      return false;
  };

  const logout = () => {
      setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{ 
        jobs, 
        candidates,
        blogPosts,
        isLoading,
        addJob, 
        updateJob, 
        deleteJob, 
        addCandidate, 
        updateCandidate,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        isGmailConnected,
        connectGmail,
        disconnectGmail,
        isAuthenticated,
        login,
        logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within an AppProvider');
  return context;
};
