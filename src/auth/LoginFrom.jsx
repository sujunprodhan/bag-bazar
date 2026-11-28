'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiAlertCircle,
  FiShoppingBag,
  FiArrowRight,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Container from '@/layout/Container';

const LoginFrom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const rawCallback = searchParams.get('callbackUrl') || '/';
  const callbackUrl = rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/';
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const displayError =
    authError ||
    (urlError === 'OAuthSignin' || urlError === 'OAuthCallback'
      ? 'Google sign-in failed. Please check GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in .env.'
      : urlError
        ? 'Authentication failed. Please try again.'
        : '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setNeedsPasswordSetup(false);
    setEnteredEmail(data.email);
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === 'GOOGLE_NO_PASSWORD') {
          setNeedsPasswordSetup(true);
          setAuthError(
            'This Google account has no password yet. Continue with Google or set a password for email login.'
          );
        } else {
          setAuthError('Invalid email or password. Please try again.');
        }
        return;
      }

      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setAuthError('Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <section className="min-h-[85vh] bg-gray-50 py-12 flex items-center">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 shadow-lg p-7 sm:p-9 animate-card-in">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center mx-auto mb-3 shadow-sm">
              <FiShoppingBag className="text-2xl" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
              Welcome Back
            </h1>
            <p className="text-muted text-sm mt-1">
              Sign in to your <span className="text-accent font-semibold">BagBazar</span> account
            </p>
          </div>

          {displayError && (
            <div className="mb-5 flex flex-col gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              <div className="flex items-center gap-2.5">
                <FiAlertCircle className="text-base shrink-0" />
                <span>{displayError}</span>
              </div>
              {needsPasswordSetup && (
                <Link
                  href={`/register?email=${encodeURIComponent(enteredEmail)}`}
                  className="self-start ml-6 text-accent font-bold underline hover:opacity-80"
                >
                  Set Password Now →
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-gray-200 focus:border-accent'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-gray-200 focus:border-accent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent hover:opacity-90 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="text-base animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || googleLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-semibold text-sm transition cursor-pointer"
          >
            {googleLoading ? (
              <FiLoader className="text-base animate-spin text-gray-500" />
            ) : (
              <FcGoogle className="text-xl" />
            )}
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href={
                callbackUrl !== '/'
                  ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : '/register'
              }
              className="text-accent font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default LoginFrom;
