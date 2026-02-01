'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-2xl font-bold transition-all duration-300 ${
            isScrolled ? 'text-gradient' : 'text-white'
          }`}
          style={
            !isScrolled
              ? {
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
                }
              : {}
          }
        >
          FinBrief
        </motion.a>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:flex items-center gap-2"
        >
          <NavLink href="/pricing" isScrolled={isScrolled}>
            Pricing
          </NavLink>
          <NavLink href="/dashboard" isScrolled={isScrolled}>
            Dashboard
          </NavLink>
          <NavLink href="/login" isScrolled={isScrolled} isAccent>
            Login
          </NavLink>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isScrolled
              ? 'text-finbrief-black hover:bg-finbrief-gray-100'
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-white/20 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-2">
              <MobileNavLink
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </MobileNavLink>
              <MobileNavLink
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                isAccent
              >
                Login
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  isAccent?: boolean;
}

function NavLink({ href, children, isScrolled, isAccent }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
        isAccent
          ? isScrolled
            ? 'text-[#0071E3] hover:bg-finbrief-blue-50'
            : 'text-[#0071E3] hover:bg-white/10'
          : isScrolled
            ? 'text-finbrief-black hover:bg-finbrief-gray-100'
            : 'text-white hover:bg-white/10'
      }`}
      style={
        !isScrolled
          ? {
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }
          : {}
      }
    >
      {children}
    </a>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  isAccent?: boolean;
}

function MobileNavLink({
  href,
  children,
  onClick,
  isAccent,
}: MobileNavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
        isAccent
          ? 'text-finbrief-blue-500 hover:bg-finbrief-blue-50'
          : 'text-finbrief-black hover:bg-finbrief-gray-100'
      }`}
    >
      {children}
    </a>
  );
}
