import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ArrowRight, CheckCircle, Users, Building2, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapComponent } from '../components/MapComponent';
import { ContactForm } from '../components/ContactForm';
import { preschoolService } from '../services/apiService';

export const HomePage = () => {

  const [searchCity, setSearchCity] = useState('');
  const [allPreSchools, setAllPreSchools] = useState([]);

  useEffect(() => {
    const fetchPreSchools = async () => {
      try {
        const response = await preschoolService.getAllPreSchools({ limit: 50 });
        if (response.data.success) {
          setAllPreSchools(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching preschools:', error);
      }
    };
    fetchPreSchools();
  }, []);

  // Scroll to contact section if #contact in URL, and on hash change
  useEffect(() => {
    const scrollToContact = () => {
      if (window.location.hash === '#contact') {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    scrollToContact();
    window.addEventListener('hashchange', scrollToContact);
    return () => window.removeEventListener('hashchange', scrollToContact);
  }, []);

  const featuredPreSchools = [
    {
      id: 1,
      name: 'Sunshine Academy',
      city: 'Delhi',
      rating: 4.8,
      monthlyFee: '₹15,000',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Rainbow Kids School',
      city: 'Mumbai',
      rating: 4.6,
      monthlyFee: '₹18,000',
      image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Little Stars PreSchool',
      city: 'Bangalore',
      rating: 4.7,
      monthlyFee: '₹16,500',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'Smart Kids Learning Center',
      city: 'Pune',
      rating: 4.5,
      monthlyFee: '₹14,000',
      image: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=300&fit=crop',
    },
  ];

  const stats = [
    { label: 'PreSchools Listed', value: '2,500+', icon: Building2, color: 'from-blue-500 to-blue-600' },
    { label: 'Parent Reviews', value: '15,000+', icon: Star, color: 'from-amber-500 to-orange-500' },
    { label: 'Cities Covered', value: '50+', icon: MapPin, color: 'from-emerald-500 to-green-600' },
    { label: 'Verified Data', value: '100%', icon: Shield, color: 'from-purple-500 to-violet-600' },
  ];

  const features = [
    {
      title: '100% Verified Data',
      description: 'All information is verified by our team. No marketing claims, just facts you can trust.',
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Parent Reviews',
      description: 'Real reviews from verified parents. Rate facilities, teachers, curriculum, and safety.',
      icon: Star,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Easy Comparison',
      description: 'Compare up to 4 preschools side-by-side. See fees, ratings, and facilities at a glance.',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Fee Transparency',
      description: 'Know all fees upfront. No hidden charges. Calculate the true cost of education.',
      icon: Shield,
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Franchise Info',
      description: 'Explore franchise opportunities with clear ROI, investment details, and support info.',
      icon: Building2,
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Location Based',
      description: 'Find preschools near your home. Easy navigation to preschool locations.',
      icon: MapPin,
      color: 'from-cyan-500 to-teal-600',
    },
  ];

  const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-28 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl floating" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl floating-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full" />

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles size={16} className="text-amber-300" />
            <span className="text-sm font-medium">Trusted by 50,000+ parents across India</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find the Perfect
            <span className="block bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">
              PreSchool for Your Child
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare preschools, fees, admission details, and verified parent reviews.
            100% transparent data with no hidden charges.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-0 focus:outline-none text-gray-800 text-lg placeholder-gray-400 rounded-xl"
                />
              </div>
              <Link
                to={`/preschools${searchCity ? `?city=${searchCity}` : ''}`}
                className="btn-primary flex items-center gap-2 text-lg px-8"
              >
                <Search size={20} />
                <span className="hidden sm:inline">Search</span>
              </Link>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="mt-8">
            <p className="text-sm text-blue-200 mb-4">Popular Cities:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCities.map((city) => (
                <Link
                  key={city}
                  to={`/preschools?city=${city}`}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 hover:-translate-y-0.5"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100/50 group hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      {allPreSchools.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                PreSchools Near You
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore preschools across India. Click on markers to view details.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100" style={{ height: '500px' }}>
              <MapComponent
                preschools={allPreSchools}
                center={[20.5937, 78.9629]}
                zoom={5}
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured PreSchools */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-2 mb-4">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-semibold">Top Rated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured PreSchools
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Highly-rated preschools verified by our team and loved by parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPreSchools.map((preschool, index) => (
              <Link
                key={preschool.id}
                to={`/preschool/${preschool.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100/50 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={preschool.image}
                    alt={preschool.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={14} className="text-amber-400" fill="currentColor" />
                    <span className="font-bold text-sm">{preschool.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {preschool.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    <MapPin size={14} />
                    {preschool.city}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary-600 text-lg">
                      {preschool.monthlyFee}
                    </span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/preschools"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              View All PreSchools
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FindYourPreSchool?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to helping parents find the best preschool for their children
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100/50 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Users size={16} />
            <span className="text-sm font-medium">Join 50,000+ happy parents</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Find the Perfect PreSchool?
          </h2>
          <p className="text-blue-100 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of parents who use FindYourPreSchool to make informed decisions about their child's education.
          </p>
          <Link
            to="/preschools"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Start Searching Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
