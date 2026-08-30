import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LiquidMetalButton } from '../../components/ui/LiquidMetalButton';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { GraduationCap, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({ email, password });
      success(`Welcome back, ${user.name}!`, 'Login Successful');

      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err: any) {
      error(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">
              CampusCare
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to your portal
          </h2>
          <p className="text-xs text-muted-foreground">
            Access your student issue portal or facility management console
          </p>
        </div>

        <Card className="shadow-xl border border-border/80 bg-card rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="student@campuscare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    Password
                  </span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-center w-full">
                <LiquidMetalButton
                  type="submit"
                  label="Sign In"
                  isLoading={isLoading}
                  fluid={true}
                  className="w-full"
                />
              </div>
            </CardContent>
          </form>

          {/* 1-Click Quick Demo Login Buttons */}
          <div className="px-6 pb-6 pt-2 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-card px-2.5 py-0.5 rounded-full text-muted-foreground font-semibold border border-border/80">
                  Quick Demo Evaluation
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillCredentials('student@campuscare.com', 'Student@123')}
                className="flex items-center justify-center gap-2 p-2.5 rounded-2xl border border-border/80 bg-muted/40 hover:bg-accent text-xs font-semibold text-foreground transition-all group"
              >
                <UserCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>Fill Student</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@campuscare.com', 'Admin@123')}
                className="flex items-center justify-center gap-2 p-2.5 rounded-2xl border border-border/80 bg-muted/40 hover:bg-accent text-xs font-semibold text-foreground transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span>Fill Admin</span>
              </button>
            </div>
          </div>

          <CardFooter className="justify-center border-t border-border/80 bg-muted/20 py-4 text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-foreground font-semibold hover:underline ml-1">
              Create student account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
