import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';

import { loginSuccess } from '../../store/authSlice.js';
import { authApi } from '../../api/auth.api.js';
import Input from '../common/Input.jsx';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().regex(emailRegex, 'Please enter a valid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError(null);
      await authApi.register(data);
      navigate('/login');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Failed to register. Email might already be in use.',
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setServerError(null);
      const res = await authApi.googleLogin({ idToken: credentialResponse.credential });
      dispatch(loginSuccess(res.data.data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">Create Account</h1>
        <p className="text-stone-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-orange-800 font-semibold hover:underline transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          {...register('fullName')}
          error={errors.fullName}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 mt-6 bg-stone-900 text-white rounded-xl font-bold hover:bg-orange-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 mb-6 relative flex items-center justify-center">
        <div className="absolute inset-x-0 border-t border-stone-200"></div>
        <span className="relative bg-white px-4 text-sm text-stone-400 font-medium">
          Or continue with
        </span>
      </div>

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setServerError('Google Login widget failed to load.')}
          theme="outline"
          size="large"
          width="100%"
        />
      </div>
    </div>
  );
}
