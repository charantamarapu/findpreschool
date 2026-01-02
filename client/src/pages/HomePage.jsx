import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapComponent } from '../components/MapComponent';
import { ContactForm } from '../components/ContactForm';
import { preschoolService } from '../services/apiService';

export const HomePage = () => {
  const [searchCity, setSearchCity] = useState('');
  const [allPreschools, setAllPreschools] = useState([]);

  useEffect(() => {
    const fetchPreschools = async () => {
      try {
        const response = await preschoolService.getAllPreschools({ limit: 50 });
        if (response.data.success) {
          setAllPreschools(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching preschools:', error);
      }
    };
    fetchPreschools();
  }, []);

  const featuredPreschools = [
    {
      id: 1,
      name: 'Sunshine Academy',
      city: 'Delhi',
      rating: 4.8,
      monthlyFee: '₹15,000',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Rainbow Kids School',
      city: 'Mumbai',
      rating: 4.6,
      monthlyFee: '₹18,000',
      image: 'https://images.unsplash.com/photo-1503454537688-e6ba5f2b8fbc?w=300&h=200&fit=crop',
    },
    {
      id: 3,
      name: 'Little Stars Preschool',
      city: 'Bangalore',
      rating: 4.7,
      monthlyFee: '₹16,500',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Smart Kids Learning Center',
      city: 'Pune',
      rating: 4.5,
      monthlyFee: '₹14,000',
      image: 'https://images.unsplash.com/photo-1427504494975-3a3a3880ed15?w=300&h=200&fit=crop',
    },
  ];

  const stats = [
    { label: 'Preschools Listed', value: '2,500+', icon: '🏫' },
    { label: 'Parent Reviews', value: '15,000+', icon: '⭐' },
    { label: 'Cities Covered', value: '50+', icon: '📍' },
    { label: 'Data Verified', value: '100%', icon: '✓' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find the Perfect Preschool for Your Child
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Compare preschools, fees, admission details, and verified parent reviews.
            100% transparent data, no hidden charges.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-0 focus:outline-none"
                />
              </div>
              <Link
                to={`/preschools${searchCity ? `?city=${searchCity}` : ''}`}
                className="btn-primary"
              >
                <Search size={20} />
                Search
              </Link>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="mt-6">
            <p className="text-sm text-primary-100 mb-3">Popular Cities:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'].map(
                (city) => (
                  <Link
                    key={city}
                    to={`/preschools?city=${city}`}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  >
                    {city}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      {allPreschools.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-center">Preschools Near You</h2>
            <p className="text-gray-600 text-center mb-8">
              Explore preschools across India
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '500px' }}>
              <MapComponent 
                preschools={allPreschools}
                center={[20.5937, 78.9629]}
                zoom={5}
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Preschools */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Featured Preschools</h2>
          <p className="text-gray-600 text-center mb-12">
            Highly-rated preschools verified by our team
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPreschools.map((preschool) => (
              <Link
                key={preschool.id}
                to={`/preschool/${preschool.id}`}
                className="card overflow-hidden group hover:-translate-y-1 transition-transform"
              >
                <div className="h-48 bg-gray-300 overflow-hidden">
                  <img
                    src={preschool.image}
                    alt={preschool.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {preschool.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{preschool.city}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" fill="currentColor" />
                      <span className="font-semibold">{preschool.rating}</span>
                    </div>
                    <span className="font-bold text-primary-600">
                      {preschool.monthlyFee}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/preschools" className="btn-primary text-lg px-8 py-3">
              View All Preschools
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose FindPreschool.org?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '100% Verified Data',
                description:
                  'All information is verified by our team. No marketing claims, just facts.',
                icon: '✓',
              },
              {
                title: 'Parent Reviews',
                description:
                  'Real reviews from verified parents. Rate facilities, teachers, and safety.',
                icon: '⭐',
              },
              {
                title: 'Easy Comparison',
                description:
                  'Compare up to 4 preschools side-by-side. See fees, ratings, and facilities.',
                icon: '📊',
              },
              {
                title: 'Fee Transparency',
                description:
                  'Know all fees upfront. No hidden charges. Calculate total cost of ownership.',
                icon: '💰',
              },
              {
                title: 'Franchise Info',
                description:
                  'Explore franchise opportunities with clear ROI and support details.',
                icon: '🏢',
              },
              {
                title: 'Location Based',
                description:
                  'Find preschools near your home. Check Google Maps location and directions.',
                icon: '📍',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find the Perfect Preschool?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of parents who use FindPreschool.org to make informed decisions.
          </p>
          <Link to="/preschools" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Start Searching Now
          </Link>
        </div>
      </section>
    </div>
  );
};
