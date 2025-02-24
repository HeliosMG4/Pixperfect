"use client";

import { navLinks } from '@/constants';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '../ui/button';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        {/* Logo */}
        <Link href="/" className="sidebar-logo">
          <Image 
            src="/assets/images/logo-text.png" 
            alt="Logo" 
            width={180} 
            height={28} 
            priority 
          />
        </Link>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li 
                    key={link.route} 
                    className={clsx(
                      'sidebar-nav_element group text-gray-700', 
                      isActive && 'bg-red-500 text-white'
                    )}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image 
                        src={link.icon} 
                        alt={link.label} 
                        width={24} 
                        height={24} 
                        className={clsx(isActive && 'brightness-200')}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              </ul>
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li 
                    key={link.route} 
                    className={clsx(
                      'sidebar-nav_element group text-gray-700', 
                      isActive && 'bg-red-500 text-white'
                    )}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image 
                        src={link.icon} 
                        alt={link.label} 
                        width={24} 
                        height={24} 
                        className={clsx(isActive && 'brightness-200')}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
                 <ul className='sidebar-nav_elements'>
              {/* User Button */}
              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton  showName />
              </li>
            </ul>
          </SignedIn>

          {/* Signed Out View */}
           <SignedOut>
            <Button asChild className="button bg-red-500 bg-cover">
              <Link href="/sign-in" >Login</Link>
            </Button>
 
           </SignedOut>
           </nav>
           </div>
           </aside>
  )
}
export default Sidebar
