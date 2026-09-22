import React, { useEffect } from 'react';
import { useAuth, useUser, SignInButton } from '../../lib/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { setApiAuthToken } from '../../lib/api';

export const AuthSync: React.FC = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function syncToken() {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (isMounted) {
            setApiAuthToken(token);
          }
        } catch (err) {
          console.warn('Failed to retrieve Clerk JWT token:', err);
          if (isMounted) {
            setApiAuthToken(null);
          }
        }
      } else {
        setApiAuthToken(null);
      }
    }

    syncToken();

    // Re-check periodically or on auth state changes
    const interval = setInterval(syncToken, 1000 * 60);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getToken, isSignedIn]);

  return null;
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/60 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-xs font-semibold text-slate-500">Checking your CraveDrop session...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md text-center space-y-4">
          <div className="w-14 h-14 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-500">
            Please sign in to your CraveDrop account to view this page and manage your food orders.
          </p>
          <div className="pt-2">
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full py-3 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition"
              >
                Sign In with Clerk
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const isAdmin =
    isSignedIn &&
    ((user?.publicMetadata as any)?.role === 'admin' ||
      user?.emailAddresses.some((e) => e.emailAddress.includes('admin') || e.emailAddress.includes('byehelllo35')));

  if (!isSignedIn || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-md text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Admin Clearance Required</h2>
          <p className="text-xs text-slate-500">
            You must be signed in with an administrative account to access the CraveDrop operations dashboard.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition"
              >
                Sign In with an Admin Account
              </button>
            </SignInButton>
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
