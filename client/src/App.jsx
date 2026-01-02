import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { PreschoolListPage } from './pages/PreschoolListPage';
import { PreschoolDetailPageWrapper } from './pages/PreschoolDetailPageWrapper';
import { ComparisonProvider, ComparisonContext } from './context/ComparisonContext';
import { FilterProvider } from './context/FilterContext';
import { ComparisonPanel } from './components/ComparisonPanel';
import './index.css';

function AppContent() {
  const { selectedPreschools } = useContext(ComparisonContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              FindPreschool.org
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 items-center">
              <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link to="/preschools" className="text-gray-600 hover:text-primary-600 font-medium">
                Browse
              </Link>
              <Link to="/preschools?city=Delhi" className="text-gray-600 hover:text-primary-600 font-medium">
                Top Cities
              </Link>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 font-medium">Contact Us</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-4">
              <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link to="/preschools" className="text-gray-600 hover:text-primary-600 font-medium">
                Browse
              </Link>
              <Link to="/preschools?city=Delhi" className="text-gray-600 hover:text-primary-600 font-medium">
                Top Cities
              </Link>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 font-medium">Contact Us</a>
            </div>
          )}
        </div>

        {/* Comparison Badge */}
        {selectedPreschools.length > 0 && (
          <div className="bg-secondary-500 text-white text-sm font-semibold px-4 py-2">
            {selectedPreschools.length} preschool{selectedPreschools.length > 1 ? 's' : ''}{' '}
            selected for comparison
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preschools" element={<PreschoolListPage />} />
          <Route path="/preschool/:id" element={<PreschoolDetailPageWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Comparison Panel */}
      {selectedPreschools.length > 0 && (
        <ComparisonPanel comparisonData={selectedPreschools} />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">FindPreschool.org</h4>
              <p className="text-gray-400 text-sm">
                The most transparent preschool comparison platform in India.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/preschools" className="hover:text-white">Browse</a></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Cities</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/preschools?city=Delhi" className="hover:text-white">Delhi</a></li>
                <li><a href="/preschools?city=Mumbai" className="hover:text-white">Mumbai</a></li>
                <li><a href="/preschools?city=Bangalore" className="hover:text-white">Bangalore</a></li>
                <li><a href="/preschools?city=Chennai" className="hover:text-white">Chennai</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © 2024 FindPreschool.org. All rights reserved. | Helping parents find the best preschools.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ComparisonProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </ComparisonProvider>
    </Router>
  );
}
