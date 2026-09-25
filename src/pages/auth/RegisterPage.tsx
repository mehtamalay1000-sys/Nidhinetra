// Nidhiनेत्र: Citizen Registration Portal (UX4G 3.0 & GIGW 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validation/schemas';
import { NidhiNetraLogo } from '@/components/common/NidhiNetraLogo';
import { GovUtilityBar } from '@/components/common/GovUtilityBar';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, ShieldCheck, Info } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const { t } = useGovSettings();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone: '',
      state: 'Maharashtra',
      district: 'Nashik',
      constituency: 'Nashik Central',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMsg(null);
      await registerAuth(data);
      navigate('/citizen/dashboard');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1F2937]">
      {/* Top Government Utility Bar */}
      <GovUtilityBar />

      <div className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-md border border-[#D9DEE5] shadow-2xs overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#123B6D] p-6 text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-3">
              <NidhiNetraLogo variant="dark" size="sm" showSubtitle={false} />
              <div>
                <h1 className="text-base font-bold">Register as Citizen Ground Observer</h1>
                <p className="text-xs text-slate-300">Public Project Monitoring & Ground Verification Portal</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...register('full_name')}
                      placeholder="e.g. Ramesh Kulkarni"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-[11px] text-rose-600">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">
                    Contact Phone <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+91 98000 00000"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="At least 8 characters"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">State</label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">District</label>
                  <input
                    type="text"
                    {...register('district')}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#123B6D]">Constituency</label>
                  <input
                    type="text"
                    {...register('constituency')}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#0B4F9C] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Citizen identities are protected under Nidhiनेत्र privacy safeguards. Your contact details are never displayed on public project pages.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-bold py-2.5 px-4 rounded-md shadow-2xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Complete Citizen Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100">
              <span className="text-xs text-[#5F6B7A]">Already registered? </span>
              <Link to="/login" className="text-xs font-bold text-[#0B4F9C] hover:underline">
                Sign In Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
