'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Chrome, Github, ArrowRight, Loader2, AlertCircle, ShoppingBag, Store, ChevronRight, ShieldCheck, Globe, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER' as const,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: 'CUSTOMER' | 'VENDOR') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/auth/register/', formData);
      if (formData.role === 'VENDOR') {
        setSuccess(response.data.message || 'Registration successful. Your account is pending admin approval.');
      } else {
        router.push('/login?message=' + encodeURIComponent(response.data.message || 'Registration successful. You can now log in.'));
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        setError(Object.values(errorData).flat().join(', '));
      } else {
        setError('Registration failed. Please try again.');
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
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Enterprise Ready</span>
              </div>
              <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                The platform built <br />
                <span className="text-blue-500">for global scale.</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
                Join over 12,000+ merchants who are scaling their digital footprint with our elite commerce infrastructure.
              </p>

              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
                <div>
                  <p className="text-3xl font-black text-white tracking-tight">99.9%</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime SLA</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white tracking-tight">24/7</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Expert Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="flex flex-col p-8 lg:p-24 justify-center items-center bg-white relative">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create your account</h2>
            <p className="text-slate-500 font-medium">Start building your digital empire today.</p>
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

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-[2.5rem] bg-slate-900 text-white text-center flex flex-col items-center gap-8 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Zap className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3">Registration Successful!</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {success}
                </p>
              </div>
              <Link href="/login" className="w-full">
                <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
                  <ShoppingBag size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Customer Registration</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    name="username"
                    type="text"
                    required
                    placeholder="Choose a unique username"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                    value={formData.password}
                    onChange={handleChange}
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

              <p className="text-[11px] text-slate-500 font-medium px-1 leading-relaxed">
                By signing up, you agree to our{' '}
                <Link href="#" className="font-bold text-slate-900 hover:text-blue-600 transition-colors underline underline-offset-2">Terms of Service</Link> and{' '}
                <Link href="#" className="font-bold text-slate-900 hover:text-blue-600 transition-colors underline underline-offset-2">Privacy Policy</Link>.
              </p>

              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary !h-14 text-base flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-black text-blue-600 hover:text-indigo-700 transition-colors uppercase tracking-widest text-xs ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
