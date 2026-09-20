import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogIn,
  Mail,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Phone,
  RotateCcw,
  Sparkles,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import { Logo } from './Logo';
import { BRANDING } from '../config/branding';

interface LandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

export const LandingPageModal: React.FC<LandingPageModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'email'>('email');
  
  // Form states
  const [email, setEmail] = useState('riyaznijam7@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('Riyaz');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Phone OTP States
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('555-019-2834');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(45);
  const [otpError, setOtpError] = useState<string | null>(null);
  
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, otpCountdown]);

  if (!isOpen) return null;

  const handleScrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Google OAuth Flow
  const handleGoogleAuth = () => {
    setFeedbackMessage('Google Workspace SSO verified. Connecting session...');
    setTimeout(() => {
      onLoginSuccess('riyaznijam7@gmail.com');
      onClose();
    }, 600);
  };

  // Send Phone OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setOtpError('Please enter a valid phone number');
      return;
    }
    setOtpError(null);
    setIsOtpSent(true);
    setOtpCountdown(45);
    setFeedbackMessage(`Security code dispatched to ${countryCode} ${phoneNumber}`);
  };

  // Verify Phone OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please input all 6 digits of your one-time verification code');
      return;
    }
    // Simulate check
    if (enteredOtp === '000000') {
      setOtpError('Security code expired or invalid. Please request a new code.');
      return;
    }
    setOtpError(null);
    setFeedbackMessage('Phone identity verified. Access granted.');
    setTimeout(() => {
      onLoginSuccess(`${countryCode} ${phoneNumber}`);
      onClose();
    }, 500);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = clean;
    setOtpDigits(updated);
    // Auto-focus next input if filled
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage('Authentication verified. Welcome to Privexa AI.');
    setTimeout(() => {
      onLoginSuccess(email);
      onClose();
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(`Enterprise account created for ${fullName} (${email}). Access granted.`);
    setTimeout(() => {
      onLoginSuccess(email);
      onClose();
    }, 500);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeedbackMessage(`Password reset link dispatched to ${email}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col">
      {feedbackMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in shrink-0">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="ml-3 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {view === 'landing' ? (
        /* SCREEN 1: LANDING PAGE */
        <div className="min-h-screen bg-[#070d1e] text-white flex flex-col justify-between">
          {/* Header Navigation with Selected Element Removed */}
          <nav className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
            <Logo
              size="md"
              textClassName="font-extrabold text-white text-lg tracking-tight"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white hover:text-blue-400 transition-colors font-medium"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo(featuresRef)}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo(howItWorksRef)}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo(aboutRef)}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                About
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="landing-close-modal-btn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
                title="Exit Preview"
                aria-label="Close portal preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </nav>

          {/* Hero Section matching Screen 1 */}
          <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Next-Gen Enterprise Privacy Defense</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Analyze Data <br />
                <span className="text-blue-500">Without Exposing</span> <br />
                Sensitive Information.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {BRANDING.name} detects sensitive data, evaluates risk, masks PII and provides
                secure, AI-powered analysis — keeping your information safe.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button
                  id="landing-get-started-btn"
                  onClick={() => setView('login')}
                  className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="landing-learn-more-btn"
                  onClick={() => handleScrollTo(featuresRef)}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Glowing Logo & Security Graphic */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Outer concentric rings */}
                <div className="absolute inset-0 rounded-full border border-blue-500/20" />
                <div className="absolute inset-6 rounded-full border border-cyan-500/20" />
                <div className="absolute w-44 h-44 rounded-2xl bg-blue-600/20 blur-xl" />

                {/* Central Privexa AI Logo in glowing card */}
                <div className="relative z-10 p-6 bg-slate-900/90 rounded-3xl border border-blue-500/40 shadow-2xl flex flex-col items-center justify-center backdrop-blur-md">
                  <Logo size="xl" showText={false} />
                  <span className="text-sm font-black text-white mt-3 tracking-tight">
                    {BRANDING.name}
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold mt-0.5">
                    AES-256 Envelope KMS
                  </span>
                </div>

                {/* Surrounding Nodes */}
                <div className="absolute top-6 left-10 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-blue-400 shadow-md">
                  <Database className="w-5 h-5" />
                </div>
                <div className="absolute bottom-6 right-10 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-cyan-400 shadow-md">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="absolute bottom-10 left-6 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-emerald-400 shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div ref={featuresRef} className="max-w-7xl mx-auto w-full px-6 pb-12 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5">
                  <Search className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">PII Detection</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Find sensitive data instantly across PDF, Word & raw text.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Risk Scoring</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Identify potential exposure risk with weighted metrics.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Data Masking</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Protect your data with reversible KMS tokens before AI.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5">
                  <Brain className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Secure AI Analysis</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Get insights safely and privately with zero identity leak.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div ref={howItWorksRef} className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-slate-800/80">
            <h3 className="text-lg font-bold text-white mb-4 text-center">How {BRANDING.name} Operates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold text-sm block mb-1">01. Ingestion & Scan</span>
                <p>Documents are ingested locally and evaluated through transformer-based PII parsers to identify financial, medical, and personal credentials.</p>
              </div>
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold text-sm block mb-1">02. Token Masking</span>
                <p>Identified entities are swapped with synthetic token placeholders while the cryptographic mapping is sealed in KMS.</p>
              </div>
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold text-sm block mb-1">03. Zero-Exposure AI</span>
                <p>Only sanitized text is dispatched to Gemini or LLM inference. Outputs are synthesized with complete identity protection.</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div ref={aboutRef} className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <Logo size="xs" showText={false} />
              <span>{BRANDING.copyright}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{BRANDING.complianceStandard}</span>
            </div>
          </div>
        </div>
      ) : (
        /* SCREEN 2: CUSTOM LOGIN / ONBOARDING JOURNEY (MATCHING USER DESIGN) */
        <div className="min-h-screen bg-slate-50 text-slate-900 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 max-w-xl mx-auto w-full shadow-sm">
            <div>
              {/* Header: Logo with Subtitle + Exit Button */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('landing')}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    <img src={BRANDING.logo.src} alt={BRANDING.logo.alt} className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                      <span>Privacy Shield AI</span>
                      <span className="text-[9px] font-semibold bg-blue-50 text-blue-700 px-1 py-0.2 rounded border border-blue-200/60">
                        v2.4
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Secure Data Analyzer</span>
                  </div>
                </div>

                <button
                  id="login-exit-btn"
                  onClick={onClose}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                  aria-label="Exit to dashboard"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {view === 'login' ? 'Welcome Back' : 'Create Enterprise Account'}
                </h2>
                <p className="text-xs text-slate-500">
                  {view === 'login'
                    ? 'Sign in to continue to your secure workspace'
                    : 'Provision authorized operator credentials with immediate dashboard access'}
                </p>
              </div>

              {view === 'login' ? (
                <div className="space-y-4">
                  {/* Google OAuth Single Sign-On Button */}
                  <button
                    id="google-oauth-btn"
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition-all group focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google Workspace</span>
                  </button>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-bold shrink-0">
                      OR
                    </span>
                  </div>

                  {/* Authentication Method Selector Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      id="tab-email-login"
                      onClick={() => setAuthMethod('email')}
                      className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        authMethod === 'email'
                          ? 'bg-white text-blue-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email & Password</span>
                    </button>
                    <button
                      type="button"
                      id="tab-otp-login"
                      onClick={() => setAuthMethod('phone')}
                      className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        authMethod === 'phone'
                          ? 'bg-white text-blue-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>OTP Login</span>
                    </button>
                  </div>

                  {/* PHONE NUMBER & OTP VERIFICATION FORM */}
                  {authMethod === 'phone' && (
                    <div className="space-y-4 text-xs">
                      {!isOtpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1.5">
                              Phone Number for One-Time Code
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-800 text-xs shrink-0"
                              >
                                {COUNTRY_CODES.map((item) => (
                                  <option key={item.code} value={item.code}>
                                    {item.flag} {item.code} ({item.country})
                                  </option>
                                ))}
                              </select>
                              <input
                                id="phone-number-input"
                                type="tel"
                                placeholder="555-019-2834"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-900 text-xs"
                              />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                              A 6-digit cryptographic verification code will be sent via SMS.
                            </p>
                          </div>

                          {otpError && (
                            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium flex items-center gap-2">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-600" />
                              <span>{otpError}</span>
                            </div>
                          )}

                          <button
                            id="send-otp-btn"
                            type="submit"
                            className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Send Verification Code</span>
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-[11px] font-medium text-blue-900">Code dispatched to</p>
                              <p className="font-bold text-slate-900">{countryCode} {phoneNumber}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOtpSent(false);
                                setOtpDigits(['', '', '', '', '', '']);
                              }}
                              className="text-[11px] text-blue-600 font-bold hover:underline"
                            >
                              Edit
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="font-semibold text-slate-700">Enter 6-Digit OTP</label>
                              <button
                                type="button"
                                onClick={() => setOtpDigits(['4', '9', '2', '8', '1', '5'])}
                                className="text-[10px] text-blue-600 font-bold hover:underline"
                              >
                                Auto-fill Demo OTP (492815)
                              </button>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                              {otpDigits.map((digit, idx) => (
                                <input
                                  key={idx}
                                  id={`otp-input-${idx}`}
                                  type="text"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                                  className="w-full h-11 text-center font-black text-lg bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none text-slate-900 transition-colors"
                                />
                              ))}
                            </div>
                          </div>

                          {otpError && (
                            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium flex items-center gap-2">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-600" />
                              <span>{otpError}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                            {otpCountdown > 0 ? (
                              <span>Resend code in <strong className="text-slate-800">{otpCountdown}s</strong></span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpCountdown(45);
                                  setFeedbackMessage('New security OTP dispatched.');
                                }}
                                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Resend Code</span>
                              </button>
                            )}
                          </div>

                          <button
                            id="verify-otp-btn"
                            type="submit"
                            className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify & Access Dashboard</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* EMAIL & PASSWORD FORM (Default active per design) */}
                  {authMethod === 'email' && (
                    <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="login-email-input"
                            type="email"
                            required
                            placeholder="you@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-900 text-xs transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="login-password-input"
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-900 text-xs transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-xs select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>Keep me signed in</span>
                        </label>

                        <button
                          id="forgot-password-btn"
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold text-xs cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        id="submit-login-btn"
                        type="submit"
                        className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* SEAMLESS ACCOUNT CREATION / ONBOARDING FLOW */
                <form onSubmit={handleSignUp} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Work Email address
                    </label>
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      placeholder="jane@enterprise.corp"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      id="signup-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-900 text-xs"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-900">
                    <span className="font-bold">Instant Onboarding:</span> Creating your account provisions your dedicated tenant and automatically authenticates your session directly to the dashboard.
                  </div>

                  <button
                    id="submit-signup-btn"
                    type="submit"
                    className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Enterprise Account & Proceed</span>
                  </button>
                </form>
              )}

              {/* Seamless Branching: No Account vs Already Have Account */}
              <div className="text-center mt-6 text-xs text-slate-500">
                {view === 'login' ? (
                  <>
                    No account yet?{' '}
                    <button
                      id="toggle-signup-btn"
                      type="button"
                      onClick={() => setView('signup')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Create one seamlessly
                    </button>
                  </>
                ) : (
                  <>
                    Already have credentials?{' '}
                    <button
                      id="toggle-login-btn"
                      type="button"
                      onClick={() => setView('login')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Log in to existing account
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-6 text-center lg:text-left border-t border-slate-100 mt-6 flex items-center justify-between">
              <button
                id="back-to-landing-btn"
                type="button"
                onClick={() => setView('landing')}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
              >
                ← Return to Public Landing Page
              </button>
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Direct Dashboard Access →
              </button>
            </div>
          </div>

          {/* Right Dark Security Column (MATCHING USER DESIGN EXACTLY) */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#0a1022] p-10 flex-col justify-between items-center text-center relative overflow-hidden border-l border-slate-800/80">
            {/* Ambient Radial Blue Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22)_0%,transparent_70%)] pointer-events-none" />

            <div className="w-full pt-4 flex items-center justify-end">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                ZERO-EXPOSURE VAULT
              </span>
            </div>

            {/* Center Content: Glowing Shield & Lock + Headline + 4 Badges */}
            <div className="relative z-10 space-y-6 max-w-sm my-auto">
              {/* Glowing Shield Translucent Card */}
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-b from-blue-500/20 to-indigo-600/10 border border-blue-400/40 flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,0.3)]">
                <div className="w-18 h-18 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={BRANDING.logo.src} alt={BRANDING.logo.alt} className="w-full h-full object-contain rounded-xl drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                </div>
              </div>

              {/* Headings */}
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                  Your Data.
                </h3>
                <h3 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight leading-tight">
                  Our Protection.
                </h3>
                <p className="text-xs text-slate-300/80 leading-relaxed pt-2 max-w-xs mx-auto">
                  Detect sensitive information, analyze risks, and keep your data secure with the power of AI.
                </p>
              </div>

              {/* 4 Feature Badges Row */}
              <div className="grid grid-cols-4 gap-2.5 pt-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight text-center">
                    Sensitive Data Detection
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-indigo-400 shadow-sm">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight text-center">
                    Risk Analysis
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-purple-400 shadow-sm">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight text-center">
                    AI-Powered Insights
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-sm">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight text-center">
                    Complete Privacy
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Brand Watermark */}
            <div className="relative z-10 w-full pb-2 text-[11px] text-slate-500 tracking-wider font-semibold">
              — PRIVACY SHIELD AI —
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

