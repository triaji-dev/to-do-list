'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';

import ThemeToggle from '@/components/ThemeToggle';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Check if sign in was successful
        const session = await getSession();
        if (session) {
          router.push('/');
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='text-foreground mt-6 text-center text-3xl font-extrabold'>
            Sign in to your account
          </h2>
          <p className='text-muted-foreground mt-2 text-center text-sm'>
            Or{' '}
            <Link
              href='/auth/signup'
              className='text-primary hover:text-primary/80 font-medium'
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='border-input bg-card text-card-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm'
                placeholder='Email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='border-input bg-card text-card-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className='text-destructive text-center text-sm'>{error}</div>
          )}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group bg-main text-primary-foreground hover:bg-main/90 focus:ring-ring focus:ring-offset-background relative flex w-full cursor-pointer justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
