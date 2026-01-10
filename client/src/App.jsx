import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Home, Search, Mail, Shield, ChevronRight, Heart, Facebook, Twitter, Instagram, Linkedin, Phone } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { PreSchoolListPage } from './pages/PreSchoolListPage';
import { PreSchoolDetailPageWrapper } from './pages/PreSchoolDetailPageWrapper';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminPreSchools from './pages/Admin/AdminPreSchools';
import AdminPreSchoolCreate from './pages/Admin/AdminPreSchoolCreate';
import AdminReviews from './pages/Admin/AdminReviews';
import AdminAdmins from './pages/Admin/AdminAdmins';
import AdminPreSchoolEdit from './pages/Admin/AdminPreSchoolEdit';
import AdminReviewEdit from './pages/Admin/AdminReviewEdit';
import AdminAdminEdit from './pages/Admin/AdminAdminEdit';
import { ComparisonProvider, ComparisonContext } from './context/ComparisonContext';
import { FilterProvider } from './context/FilterContext';
import { ComparisonPanel } from './components/ComparisonPanel';
import './index.css';


function AppContent() {
  const { selectedPreSchools } = useContext(ComparisonContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current path is admin
  const isAdminPage = location.pathname.startsWith('/admin');

  // Custom handler for Contact Us link
  const handleContactClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Custom handler for Home link
  const handleHomeClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check if link is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Navigation - Only show on non-admin pages */}
      {!isAdminPage && (
        <nav className="nav-glass z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group" onClick={handleHomeClick}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    FindYourPreSchool
                  </div>
                  <div className="text-xs text-gray-500 font-medium -mt-0.5 tracking-wide">
                    discover · compare · decide
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/') && location.pathname === '/'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                >
                  <Home size={18} />
                  Home
                </Link>
                <Link
                  to="/preschools"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/preschools')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                >
                  <Search size={18} />
                  Browse
                </Link>
                <a
                  href="#contact"
                  onClick={handleContactClick}
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  <Mail size={18} />
                  Contact
                </a>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <Link
                  to="/admin/login"
                  className="px-4 py-2 rounded-lg font-medium text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-slide-down">
                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    onClick={handleHomeClick}
                    className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive('/') && location.pathname === '/'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Home size={20} />
                    Home
                  </Link>
                  <Link
                    to="/preschools"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive('/preschools')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Search size={20} />
                    Browse PreSchools
                  </Link>
                  <a
                    href="#contact"
                    onClick={handleContactClick}
                    className="px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-3"
                  >
                    <Mail size={20} />
                    Contact Us
                  </a>
                  <div className="border-t border-gray-100 my-2" />
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-3"
                  >
                    <Shield size={20} />
                    Admin Panel
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Comparison Badge */}
          {selectedPreSchools.length > 0 && (
            <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-sm font-semibold px-4 py-2.5 flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {selectedPreSchools.length}
              </span>
              preschool{selectedPreSchools.length > 1 ? 's' : ''} selected for comparison
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className={isAdminPage ? '' : 'page-transition'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preschools" element={<PreSchoolListPage />} />
          <Route path="/preschool/:id" element={<PreSchoolDetailPageWrapper />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/preschools" element={<AdminPreSchools />} />
          <Route path="/admin/preschools/new" element={<AdminPreSchoolCreate />} />
          <Route path="/admin/preschools/create" element={<AdminPreSchoolCreate />} />
          <Route path="/admin/preschools/:id" element={<AdminPreSchoolEdit />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reviews/:id" element={<AdminReviewEdit />} />
          <Route path="/admin/admins" element={<AdminAdmins />} />
          <Route path="/admin/admins/:id" element={<AdminAdminEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Comparison Panel */}
      {selectedPreSchools.length > 0 && (
        <ComparisonPanel comparisonData={selectedPreSchools} />
      )}

      {/* Footer - Only show on non-admin pages */}
      {!isAdminPage && (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white mt-16 relative overflow-hidden">
          {/* Decorative gradient line */}
          <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500" />

          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand Column */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">FindYourPreSchool</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  India's most transparent preschool comparison platform. Helping parents make informed decisions with verified data.
                </p>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Browse PreSchools', href: '/preschools' },
                    { label: 'About Us', href: '#' },
                    { label: 'Contact', href: '#contact' },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <ChevronRight size={14} className="text-primary-500 group-hover:translate-x-1 transition-transform" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Cities */}
              <div>
                <h4 className="font-bold text-lg mb-4">Popular Cities</h4>
                <ul className="space-y-3">
                  {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'].map((city) => (
                    <li key={city}>
                      <Link
                        to={`/preschools?city=${city}`}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <ChevronRight size={14} className="text-primary-500 group-hover:translate-x-1 transition-transform" />
                        PreSchools in {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-bold text-lg mb-4">Legal</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Privacy Policy', href: '#' },
                    { label: 'Terms & Conditions', href: '#' },
                    { label: 'Disclaimer', href: '#' },
                    { label: 'Cookie Policy', href: '#' },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <ChevronRight size={14} className="text-primary-500 group-hover:translate-x-1 transition-transform" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} FindYourPreSchool. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                Made with <Heart size={14} className="text-red-500" fill="currentColor" /> for parents in India
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="text-8xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ComparisonProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </ComparisonProvider>
    </Router>
  );
}
