import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LiquidMetalButton } from '../../components/ui/LiquidMetalButton';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { GraduationCap, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      error('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register({ name, email, password, confirmPassword });
      success(`Account created! Welcome, ${user.name}.`, 'Registration Complete');
      navigate('/student/dashboard', { replace: true });
    } catch (err: any) {
      error(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
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
            Create Student Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Join the smart campus issue resolution portal
          </p>
        </div>

        <Card className="shadow-xl border border-border/80 bg-card rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  Full Name
                </label>
                <Input
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Campus Email
                </label>
                <Input
                  type="email"
                  placeholder="alex.rivera@university.edu"
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
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  Confirm Password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 flex justify-center w-full">
                <LiquidMetalButton
                  type="submit"
                  label="Create Account"
                  isLoading={isLoading}
                  fluid={true}
                  className="w-full"
                />
              </div>
            </CardContent>
          </form>

          <CardFooter className="justify-center border-t border-border/80 bg-muted/20 py-4 text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground font-semibold hover:underline ml-1">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
