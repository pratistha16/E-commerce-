'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Chrome, Github, ArrowRight, Loader2, AlertCircle, CheckCircle2, ChevronRight, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) setMessage(msg);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.post('/auth/login/', { username, password });
      const user = await login(response.data.access, response.data.refresh);
      
      if (user) {
        const isSubdomain = window.location.hostname.split('.').length > 2 && !window.location.hostname.includes('localhost') || 
                          (window.location.hostname.includes('localhost') && window.location.hostname.split('.').length > 1 && window.location.hostname !== 'localhost');
        
        if (user.role === 'ADMIN' || user.role === 'CUSTOMER') {
          if (isSubdomain) {
            setError('Admins and Customers must log in from the main domain.');
            logout();
            setLoading(false);
            return;
          }
          if (user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/profile');
          }
        } else if (user.role === 'VENDOR') {
          if (!isSubdomain) {
            setError('Merchants must log in from their store\'s subdomain.');
            logout();
            setLoading(false);
            return;
          }
          router.push('/dashboard');
        }
      } else {
        router.push('/');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail;
      if (errorMsg === 'No active account found with the given credentials') {
        setError('Your account is either invalid or pending admin approval.');
      } else {
        setError(errorMsg || 'Invalid credentials. Please check your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden lg:flex flex-col bg-slate-900 p-16 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              M
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">
              Global<span className="text-slate-400">Merchant</span>
            </span>
          </Link>

          <div className="mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Access</span>
              </div>
              <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                Manage your <br />
                <span className="text-blue-500">digital commerce.</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
                Access your platform control center, monitor real-time sales, and scale your merchant ecosystem with ease.
              </p>

              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
                <div>
                  <p className="text-3xl font-black text-white tracking-tight">256-bit</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Encryption</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white tracking-tight">12k+</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Active Users</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col p-8 lg:p-24 justify-center items-center bg-white relative">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-600 text-sm font-medium"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-600 text-sm font-medium"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {message}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-black text-blue-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center ml-1">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-slate-200 rounded-lg cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 font-bold cursor-pointer uppercase tracking-widest">
                Remember for 30 days
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !h-14 text-base flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => toast.info('Google Sign-In', { description: 'Social authentication requires API keys. Please configure them in your environment variables.' })}
              className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all group"
            >
              <Chrome size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Google</span>
            </button>
            <button 
              onClick={() => toast.info('GitHub Sign-In', { description: 'Social authentication requires API keys. Please configure them in your environment variables.' })}
              className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all group"
            >
              <Github size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">GitHub</span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-black text-blue-600 hover:text-indigo-700 transition-colors uppercase tracking-widest text-xs ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
