import Image from "next/image";
import Link from "next/link";
import defaultMetadata from '@/lib/metadata';
import { auth } from '@/lib/auth';

export const metadata = {
  ...defaultMetadata,
  title: 'Planova - Project Management System',
  description: 'A modern, full-stack project management system built with Next.js',
};

export default async function Home() {
  const session = await auth();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-black">Planova</h1>
        </div>
        <p className="text-xl text-center sm:text-left text-black font-medium">
          A modern, full-stack project management system
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-black">Project Management</h2>
            <p className="text-black">
              Create, organize, and track projects with ease
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-black">Task Tracking</h2>
            <p className="text-black">
              Assign tasks, set deadlines, and monitor progress
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-black">Team Collaboration</h2>
            <p className="text-black">
              Work together with your team in real-time
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {session ? (
            <>
              <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/dashboard"
              >
                Go to Dashboard
              </Link>
              <Link
                className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-100 hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="/projects"
              >
                View Projects
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/auth/register"
              >
                Get Started
              </Link>
              <Link
                className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-100 hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="/auth/login"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          GitHub
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700"
          href="/dashboard"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Dashboard →
        </a>
      </footer>
    </div>
  );
}