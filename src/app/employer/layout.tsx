'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation'; 
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  BuildingOfficeIcon,
  UserIcon,
  PlusIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', href: '/employer', icon: HomeIcon },
  { label: 'Jobs', href: '/employer/jobs', icon: BriefcaseIcon },
  { label: 'Applicants', href: '/employer/applicants', icon: UsersIcon },
  { label: 'Company Profile', href: '/employer/company-profile', icon: BuildingOfficeIcon },
  { label: 'profile', href: '/employer/profile', icon: UserIcon },
];

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const {logout} = useAuth();

    const handleLogout = async () => {
      try {
        await logout();
        router.push('/');
        toast.success('Logged out successfully!');
      }
      catch (error) {
        console.error('Logout error:', error);
      }
    };

  return (
    <div className="flex min-h-screen bg-[#f6faf7] font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col bg-[#416b46] text-white z-20">
        {/* Logo */}
        <div className="py-8 px-6 text-center border-b border-[#365c39]">
          <h1 className="text-2xl font-extrabold tracking-wide select-none">JobSphere</h1>
          <p className="text-xs font-light text-[#a3b493] mt-1 select-none">Hiring Platform</p>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href === '/employer' && pathname === '/employer/');
            return (
              <Link
                key={label}
                href={href}
                className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium select-none
                  ${isActive ? 'bg-[#314939] text-white' : 'hover:bg-[#314939] text-white'}
                `}
              >
                <Icon
                  className={`mr-3 h-6 w-6 ${isActive ? 'text-[#accba7]' : 'text-white group-hover:text-[#accba7]'}`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Sign Out Link - bottom */}
        <div className="px-6 pb-6 mt-auto select-none">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#314939] px-3 py-2 font-semibold text-white hover:bg-[#253224] active:bg-[#1e2a1d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#253224]"
            onClick={handleLogout}
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="ml-56 flex-1 pl-2">{children}</main>
    </div>
  );
}
