'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAdminToken, hasAdminToken } from '@/lib/adminAuth';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (hasAdminToken()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setAdminToken(data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-container" style={{
      background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(88, 28, 135) 50%, rgb(17, 24, 39) 100%)'
    }}>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="admin-card p-8">
            {/* Header */}
            <div className="text-center mb-6">
              {/* IEEE Badge - matching home style */}
              <div className="admin-badge inline-flex mb-3">
                <div className="admin-badge-dot"></div>
                <span className="uppercase tracking-widest text-xs">IEEE SB UCEK</span>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2 admin-title-glow">
                CodeForge 3.0
              </h1>
              <p className="text-base font-semibold text-purple-300 mb-1">
                Admin Panel
              </p>
              <p className="text-purple-100 text-sm">
                Sign in to access the dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="admin-alert admin-alert-error">
                <p className="text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-purple-200 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="admin-loading"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-purple-900/30">
              <p className="text-center text-xs text-purple-300/60">
                🔒 Secure admin access only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
