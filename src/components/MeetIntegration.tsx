import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initWorkspaceAuth, googleSignIn, getAccessToken, logoutWorkspace } from '../lib/workspaceAuth';
import { Video, Calendar, Loader2, Plus, ExternalLink } from 'lucide-react';

export default function MeetIntegration() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (user, token) => {
        setToken(token);
        setUser(user);
        setNeedsAuth(false);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutWorkspace();
    setNeedsAuth(true);
    setToken(null);
    setUser(null);
  };

  const createMeeting = async () => {
    if (!token) return;
    setIsCreating(true);
    try {
      const res = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.meetingUri) {
        setMeetLink(data.meetingUri);
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to create Google Meet space.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Google Meet</h3>
          <p className="text-sm text-slate-400">Create instant meetings directly</p>
        </div>
      </div>

      {needsAuth ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-slate-300 text-sm">Sign in with Google to create Meet links.</p>
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Signed in as {user?.email}</span>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
          
          {!meetLink ? (
            <button
              onClick={createMeeting}
              disabled={isCreating}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Create Instant Meeting
            </button>
          ) : (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex flex-col gap-3">
              <p className="text-sm text-blue-200 font-medium">Meeting Created Successfully!</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={meetLink} 
                  className="bg-black/20 text-white text-sm px-3 py-2 rounded-lg w-full focus:outline-none"
                />
                <a 
                  href={meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <button
                onClick={() => setMeetLink(null)}
                className="text-xs text-slate-400 hover:text-white text-left mt-1"
              >
                Create another meeting
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
