import React, { useState, useEffect } from 'react';
import { Shield, Lock, KeyRound, ArrowLeft, Eye, EyeOff, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';
import { AdminSession } from '../types';

interface AdminLoginGateProps {
  onLoginSuccess: (session: AdminSession) => void;
  onCancel: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMsg(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      // Check current stored password or fallback to default
      const savedAdminUser = localStorage.getItem('nexus_admin_user') || 'admin';
      const savedAdminPass = localStorage.getItem('nexus_admin_password') || 'admin123';

      const validUser = username.trim() === savedAdminUser || username.trim() === 'admin@nexus.tech';
      const validPass = password === savedAdminPass;

      if (validUser && validPass) {
        // Success
        const session: AdminSession = {
          isAuthenticated: true,
          username: username.trim(),
          token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          loginAt: new Date().toLocaleString('vi-VN'),
        };

        if (rememberMe) {
          localStorage.setItem('nexus_admin_session', JSON.stringify(session));
        } else {
          sessionStorage.setItem('nexus_admin_session', JSON.stringify(session));
        }

        onLoginSuccess(session);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutSeconds(30);
          setErrorMsg('Cảnh báo an ninh: Bạn đã nhập sai quá 5 lần. Tạm khóa truy cập trong 30 giây.');
        } else {
          setErrorMsg(`Tài khoản hoặc mật khẩu không chính xác! (Lần thử ${nextAttempts}/5)`);
        }
      }
    }, 600);
  };

  const handleQuickFill = () => {
    const savedAdminUser = localStorage.getItem('nexus_admin_user') || 'admin';
    const savedAdminPass = localStorage.getItem('nexus_admin_password') || 'admin123';
    setUsername(savedAdminUser);
    setPassword(savedAdminPass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-200 flex flex-col justify-center items-center p-4 relative font-sans">
      
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-[#0B0F17] border border-cyan-500/40 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] p-6 sm:p-8 backdrop-blur-md">
        
        {/* Top Return Button */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang Blog</span>
        </button>

        {/* Shield Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="w-7 h-7" />
          </div>

          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Xác Thực Quản Trị Viên</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
            NEXUS ADMIN ACCESS
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Khu vực hạn chế. Chỉ quản trị viên được cấp quyền mới có thể đăng nhập để quản lý bài viết.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-300 text-xs font-mono flex items-start gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-slate-400">
              Tài khoản quản trị *
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                disabled={lockoutSeconds > 0 || isVerifying}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập (ví dụ: admin)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-md text-white text-xs font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-slate-400">
              Mật khẩu bảo mật *
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockoutSeconds > 0 || isVerifying}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị viên"
                className="w-full px-3.5 py-2.5 pr-10 bg-slate-950 border border-slate-800 rounded-md text-white text-xs font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
              />
              <span>Duy trì phiên đăng nhập</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={lockoutSeconds > 0 || isVerifying}
            className="w-full py-2.5 mt-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-mono font-bold rounded-md transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Đang xác thực thông tin...</span>
              </>
            ) : lockoutSeconds > 0 ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Tạm khóa: {lockoutSeconds}s</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Đăng Nhập Quản Trị</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper Box */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Thông tin truy cập mặc định:</span>
            </span>
            <button
              onClick={handleQuickFill}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer"
            >
              Điền nhanh
            </button>
          </div>

          <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex justify-between items-center">
            <div>
              <span className="text-slate-500">Tài khoản:</span> <span className="text-white font-bold">admin</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500">Mật khẩu:</span> <span className="text-white font-bold">admin123</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-center">
            (Quản trị viên có thể đổi tài khoản &amp; mật khẩu trong tab Cài đặt của Admin Console)
          </div>
        </div>

      </div>
    </div>
  );
};
