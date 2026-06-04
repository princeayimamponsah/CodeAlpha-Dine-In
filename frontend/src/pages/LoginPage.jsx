import React, { useEffect, useState } from 'react';
import { authService } from '../services/apiServices';
import { Button, Input, Card, BrandMark } from '../components/UI';
import { useAuthStore } from '../context/store';
import { useNotificationStore } from '../context/store';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock3, Lock, Mail, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const navigate = useNavigate();

  const decodeAuthPayload = (value) => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    const googleError = params.get('google_error');

    if (googleError) {
      addNotification({ type: 'error', message: 'Google sign-in failed' });
      window.history.replaceState({}, '', '/login');
      return;
    }

    if (!auth) {
      return;
    }

    try {
      const decoded = decodeAuthPayload(auth);
      if (decoded?.token && decoded?.user) {
        setAuth(decoded.user, decoded.token);
        addNotification({ type: 'success', message: 'Google sign-in successful!' });
        navigate('/dashboard');
      }
    } catch {
      addNotification({ type: 'error', message: 'Unable to complete Google sign-in' });
    } finally {
      window.history.replaceState({}, '', '/login');
    }
  }, [addNotification, navigate, setAuth]);

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiBase}/auth/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.login(email, password);
      setAuth(data.data.user, data.data.token);
      addNotification({
        type: 'success',
        message: 'Login successful!',
      });
      navigate('/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[36px] border border-gold/25 bg-wine p-8 text-cream shadow-[0_30px_90px_rgba(109,31,61,0.28)] lg:p-10"
        >
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cream/90 backdrop-blur-md">
                <Sparkles size={14} /> Premium hospitality operations
              </div>
              <h1 className="max-w-xl text-5xl font-semibold leading-none tracking-tight text-cream sm:text-6xl">
                Calm, elegant control for every table, ticket, and turn.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-cream/80 sm:text-base">
                DINE-IN gives your team a refined command center for floor operations, reservations, inventory, and daily revenue without the clutter of a generic admin tool.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: CheckCircle2, label: 'Live service', value: '24/7' },
                { icon: Clock3, label: 'Avg response', value: '2m 14s' },
                { icon: ShieldCheck, label: 'Trusted by staff', value: '97%' },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <item.icon size={18} className="text-peach" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream/65">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-cream">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="relative"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
            <div className="mb-8 text-center">
              <BrandMark className="mx-auto mb-4 w-52" imgClassName="w-full" />
              <h2 className="text-4xl font-semibold tracking-tight text-charcoal">Welcome back</h2>
              <p className="mt-2 text-sm text-softgray">Sign in to your restaurant operations dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-[2.5rem] text-softgray" size={18} />
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-[2.5rem] text-softgray" size={18} />
                <Input
                  label="Password"
                  type="password"
                  placeholder="........."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="group w-full"
                loading={loading}
              >
                Sign In
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>

              <GoogleSignInButton onClick={handleGoogleLogin} />

              <p className="text-center text-xs text-softgray">
                Use your Google account to sign in quickly and securely.
              </p>
            </form>

            

            <div className="mt-5 rounded-[24px] border border-white/75 bg-white/70 p-5 text-center shadow-soft">
              <Link to="/signup" className="mt-2 inline-flex items-center gap-2 font-semibold text-wine transition-colors hover:text-gold">
                Create an account <ArrowRight size={16} />
              </Link>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};
