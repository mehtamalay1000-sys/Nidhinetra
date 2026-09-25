// Nidhiनेत्र: Official Authentication Portal (UX4G 3.0 & GIGW 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validation/schemas';
import { NidhiNetraLogo } from '@/components/common/NidhiNetraLogo';
import { GovUtilityBar } from '@/components/common/GovUtilityBar';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  Cpu,
  Camera,
  UserCheck,
  Lock,
  Mail,
  AlertCircle,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const { t } = useGovSettings();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'citizen@nidhinetra.gov.in',
      password: 'Password@123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      const user = await login(data);
      if (user.role === 'reviewer') navigate('/reviewer/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Invalid credentials');
    }
  };

  const handleQuickDemo = (role: 'citizen' | 'reviewer' | 'admin') => {
    switchDemoRole(role);
    if (role === 'reviewer') navigate('/reviewer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/citizen/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1F2937]">
      {/* Top Government Utility Bar */}
      <GovUtilityBar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Column: Brand Story & Civic Intelligence Architecture (UX4G Government Deep Blue) */}
        <div className="md:w-1/2 bg-[#123B6D] p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white border-b md:border-b-0 md:border-r border-blue-900">
          <div>
            <div className="mb-6">
              <NidhiNetraLogo variant="dark" size="lg" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
              Connect official project data, ground evidence and accountable review.
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg">
              An explainable AI intelligence workflow that assists citizens and verification officers in monitoring public development expenditures from sanction to ground resolution.
            </p>

            {/* Traceable Workflow Steps (Prompt Section 13) */}
            <div className="bg-[#0B4F9C]/60 border border-blue-700/60 rounded-md p-4 mb-6 max-w-md">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300 block mb-3">
                Traceable Governance Architecture
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-blue-950/60 border border-blue-600 flex items-center justify-center text-blue-200 shrink-0">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Project Data</p>
                    <p className="text-[11px] text-slate-300">Sanction decrees, PWD milestone schedules, vendors</p>
                  </div>
                </div>

                <div className="w-0.5 h-2.5 bg-blue-400 ml-3.5" />

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-blue-950/60 border border-blue-600 flex items-center justify-center text-blue-200 shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Risk Analysis</p>
                    <p className="text-[11px] text-slate-300">Timeline delay, drawdown velocity, peer deviation</p>
                  </div>
                </div>

                <div className="w-0.5 h-2.5 bg-blue-400 ml-3.5" />

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-blue-950/60 border border-blue-600 flex items-center justify-center text-blue-200 shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Citizen Evidence</p>
                    <p className="text-[11px] text-slate-300">Geo-tagged photo submissions & on-ground verification</p>
                  </div>
                </div>

                <div className="w-0.5 h-2.5 bg-blue-400 ml-3.5" />

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-blue-950/60 border border-blue-600 flex items-center justify-center text-blue-200 shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Human Review</p>
                    <p className="text-[11px] text-slate-300">Departmental inspection orders, action, resolution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 border-t border-blue-800/80 pt-4 flex items-center justify-between">
            <span>Smart India Hackathon 2026 Prototype</span>
            <span className="text-amber-300 font-semibold">GIGW 3.0 & UX4G Standard</span>
          </div>
        </div>

        {/* Right Column: Government Login Form & Evaluator Demo Access */}
        <div className="md:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C]" />
                Official Single Sign-On
              </div>
              <h2 className="text-2xl font-bold text-[#123B6D]">Sign In to Nidhiनेत्र</h2>
              <p className="text-xs text-[#5F6B7A] mt-1">
                Enter your credentials to access public project monitoring & verification.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#123B6D]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="e.g. citizen@nidhinetra.gov.in"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-600 mt-0.5">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#123B6D]">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo password is Password@123')}
                    className="text-xs text-[#0B4F9C] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-600 mt-0.5">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-bold py-2.5 px-4 rounded-md shadow-2xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1 border-t border-slate-100">
              <span className="text-xs text-[#5F6B7A]">Don't have an account? </span>
              <Link to="/register" className="text-xs font-bold text-[#0B4F9C] hover:underline">
                Create Citizen Account
              </Link>
            </div>

            {/* Hackathon Demo Access Area for Judges (Section 13 & 50) */}
            <div className="pt-4 border-t border-[#D9DEE5] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#123B6D] uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#E87B18]" />
                  Hackathon Evaluator Quick Access
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded">
                  1-Click Role Access
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="p-2.5 rounded-md border border-slate-300 bg-[#F7F8FA] hover:bg-blue-50 hover:border-[#0B4F9C] text-left transition-colors group"
                >
                  <span className="block text-xs font-bold text-[#0B4F9C]">Citizen Demo</span>
                  <span className="block text-[11px] text-[#5F6B7A] truncate">Aarav Deshmukh</span>
                  <span className="block text-[10px] text-slate-500 font-medium mt-1">Ground Observer &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('reviewer')}
                  className="p-2.5 rounded-md border border-slate-300 bg-[#F7F8FA] hover:bg-amber-50 hover:border-amber-500 text-left transition-colors group"
                >
                  <span className="block text-xs font-bold text-[#B7791F]">Reviewer Demo</span>
                  <span className="block text-[11px] text-[#5F6B7A] truncate">Rahul Sharma</span>
                  <span className="block text-[10px] text-slate-500 font-medium mt-1">Verification Officer &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-2.5 rounded-md border border-slate-300 bg-[#F7F8FA] hover:bg-emerald-50 hover:border-emerald-500 text-left transition-colors group"
                >
                  <span className="block text-xs font-bold text-[#2E7D32]">Admin Demo</span>
                  <span className="block text-[11px] text-[#5F6B7A] truncate">Priya Kulkarni</span>
                  <span className="block text-[10px] text-slate-500 font-medium mt-1">Collectorate Admin &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
