'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

import { AddTaskForm, TaskList } from '@/components/TaskComponents';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session, status } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className='flex min-h-screen flex-col justify-between bg-neutral-100 dark:bg-neutral-900'>
      {/* Header with Theme Toggle */}
      <header className='border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-neutral-800/80'>
        <div className='container mx-auto flex items-center justify-between px-4 py-4'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Todo List
          </h2>
          <ThemeToggle />
        </div>
      </header>

      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='mb-6 text-5xl font-bold text-gray-900 dark:text-white'>
            Todo List App
          </h1>

          {status === 'loading' ? (
            <div className='mx-auto mb-8 max-w-2xl'>
              <div className='animate-pulse'>
                <div className='mx-auto mb-2 h-4 w-3/4 rounded bg-gray-300'></div>
                <div className='mx-auto h-4 w-1/2 rounded bg-gray-300'></div>
              </div>
            </div>
          ) : session ? (
            // Tampilan untuk user yang sudah sign in
            <div className='w-full'>
              <div className='mb-8 text-center'>
                <p className='text-foreground mx-auto mb-4 max-w-2xl text-xl'>
                  Welcome back,{' '}
                  <span className='text-primary font-semibold'>
                    {session.user?.name || session.user?.email}
                  </span>
                  !
                </p>
                <p className='text-muted-foreground mx-auto mb-6 max-w-2xl text-sm'>
                  Ready to manage your tasks?
                </p>

                <div className='mb-8 space-x-4'>
                  <Link href='/dashboard'>
                    <Button size='lg' variant='default'>
                      Full Dashboard
                    </Button>
                  </Link>
                  <Button
                    size='lg'
                    variant='outline'
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Task Management Section */}
              <div className='mx-auto max-w-6xl'>
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                  <AddTaskForm
                    onTaskCreated={() => setRefreshTrigger((prev) => prev + 1)}
                  />
                  <TaskList refreshTrigger={refreshTrigger} />
                </div>
              </div>
            </div>
          ) : (
            // Tampilan untuk user yang belum sign in
            <>
              <p className='mx-auto mb-8 max-w-2xl text-sm text-gray-600 dark:text-gray-400'>
                Unlock your full potential by seamlessly organizing your tasks
                and achieving your goals.
              </p>

              <div className='space-x-4'>
                <Link href='/auth/signin'>
                  <Button
                    size='lg'
                    className='text-accent hover:text-accent-foreground dark:text-accent dark:hover:text-accent-foreground bg-main hover:bg-main-hover shadow-none hover:shadow-sm'
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href='/auth/signup'>
                  <Button size='lg' variant='outline'>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className='border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-neutral-800'>
        <div className='container mx-auto px-4 py-8 text-center text-xs text-gray-600 dark:text-gray-100'>
          <p>© 2025 Todo List App. All rights reserved. Built using Next.js</p>
        </div>
      </footer>
    </div>
  );
}
