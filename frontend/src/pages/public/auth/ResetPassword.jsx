import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setMessage({ type: 'error', text: 'Invalid reset link' });
    }
  }, [token, email]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMessage({ type: 'error', text: "Passwords don't match" });
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { token, email, newPassword: password });
      setMessage({ type: 'success', text: res.meta?.message || 'Password reset successful' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-[#1E3A8A]/20">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#0D9488] transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#1E3A8A] mb-6 text-center">Reset Password</h2>

        {message && (
          <div className={`p-3 mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#1E3A8A]/30 rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
            <input
              required
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-[#1E3A8A]/30 rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white py-3 rounded-xl font-semibold hover:shadow-xl transform transition-all duration-200 ${!loading && 'hover:scale-105'}`}
          >
            {loading ? 'Saving...' : 'Save new password'}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Remembered your password?{' '}
          <Link to="/login" className="text-[#0D9488] font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
