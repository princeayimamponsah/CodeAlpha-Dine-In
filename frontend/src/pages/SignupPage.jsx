import React, { useEffect, useState } from 'react';
import { authService } from '../services/apiServices';
import { Button, Input, Card, BrandMark } from '../components/UI';
import { useAuthStore } from '../context/store';
import { useNotificationStore } from '../context/store';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      addNotification({ type: 'error', message: 'Please complete all required fields' });
      return;
    }

    if (password.length < 8) {
      addNotification({ type: 'error', message: 'Password must be at least 8 characters' });
      return;
    }

    if (password !== confirmPassword) {
      addNotification({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      const { data } = await authService.register({ name, email, password });
      setAuth(data.data.user, data.data.token);
      addNotification({
        type: 'success',
        message: 'Account created successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          'Signup failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(247,214,194,0.65),_transparent_42%),linear-gradient(180deg,#FFF7F2_0%,#fff_100%)] p-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <BrandMark className="mx-auto mb-4 w-52" imgClassName="w-full" />
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-charcoal">Join the team</h1>
          <p className="text-sm uppercase tracking-[0.2em] text-softgray">Create your restaurant account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-10 text-gray-400" size={20} />
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-10 text-gray-400" size={20} />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              
              <Input
                label="Password"
                type="password"
                
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              
              <Input
                label="Confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-softgray">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-wine transition-colors hover:text-gold">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;