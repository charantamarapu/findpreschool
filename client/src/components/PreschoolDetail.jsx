import React, { useState, useEffect } from 'react';
import { Heart, Share2, MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import { formatCurrency, calculateAnnualCost, formatDate } from '../utils/helpers';
import { SchoolContactForm } from './SchoolContactForm';

export const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
        No Images Available
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden group">
      <img
        src={images[currentIndex].image_url}
        alt={`Preschool ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                currentIndex === 0 ? images.length - 1 : currentIndex - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ❮
          </button>
          <button
            onClick={() =>
              setCurrentIndex(
                currentIndex === images.length - 1 ? 0 : currentIndex + 1
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ❯
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const PreschoolDetailPage = ({ preschool }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liked, setLiked] = useState(false);

  if (!preschool) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching preschool details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{preschool.name}</h1>
            {preschool.verified_status && (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Verified School
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-3 rounded-full border-2 transition-colors ${
                liked
                  ? 'bg-red-100 border-red-500 text-red-500'
                  : 'border-gray-300 text-gray-600 hover:border-red-500'
              }`}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-primary-600">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        {/* Rating Summary */}
        {preschool.admission && (
          <div className="flex items-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-2xl">★</span>
              <span className="font-bold">
                {parseFloat(preschool.admission.verified_rating) || 0 > 0
                  ? parseFloat(preschool.admission.verified_rating).toFixed(1)
                  : 'No'}
              </span>
              <span className="text-gray-600">
                ({preschool.admission.total_reviews || 0} reviews)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Image Carousel */}
      <div className="mb-8">
        <ImageCarousel images={preschool.images || []} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Contact Info */}
        <div className="col-span-2">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            {['overview', 'admission', 'franchise', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-4">Location & Contact</h3>
                <div className="space-y-3">
                  {preschool.address && (
                    <div className="flex gap-3">
                      <MapPin className="text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-gray-600">{preschool.address}</p>
                      </div>
                    </div>
                  )}
                  {preschool.phone && (
                    <div className="flex gap-3">
                      <Phone className="text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <a
                          href={`tel:${preschool.phone}`}
                          className="text-primary-600 hover:underline"
                        >
                          {preschool.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {preschool.email && (
                    <div className="flex gap-3">
                      <Mail className="text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <a
                          href={`mailto:${preschool.email}`}
                          className="text-primary-600 hover:underline"
                        >
                          {preschool.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {preschool.website && (
                    <div className="flex gap-3">
                      <Globe className="text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Website</p>
                        <a
                          href={preschool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admission' && preschool.admission && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Fee Structure</h3>
              <div className="grid grid-cols-2 gap-4">
                {preschool.admission.monthly_fee && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(preschool.admission.monthly_fee)}
                    </p>
                  </div>
                )}
                {preschool.admission.annual_fee && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Annual Fee</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(preschool.admission.annual_fee)}
                    </p>
                  </div>
                )}
                {preschool.admission.registration_fee && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Registration Fee</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(preschool.admission.registration_fee)}
                    </p>
                  </div>
                )}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Total Annual Cost</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(calculateAnnualCost(preschool.admission))}
                  </p>
                </div>
              </div>

              {preschool.admission.age_criteria && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-1">Age Criteria</p>
                  <p className="text-gray-600">{preschool.admission.age_criteria}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'franchise' && preschool.franchise && (
            <div className="space-y-4">
              {preschool.franchise.franchise_available ? (
                <>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 font-semibold">✓ Franchise Opportunities Available</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Initial Investment</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(preschool.franchise.initial_investment || 0)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Royalty</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {preschool.franchise.royalty_percentage}%{' '}
                        <span className="text-sm">({preschool.franchise.royalty_type})</span>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600">Franchise opportunities not available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && preschool.reviews && (
            <div className="space-y-4">
              {preschool.reviews.length > 0 ? (
                preschool.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{review.parent_name}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(Math.round(review.rating))].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    {review.review_text && (
                      <p className="text-gray-600 mt-2">{review.review_text}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No verified reviews yet</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-semibold">{preschool.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="font-semibold">{preschool.state || 'N/A'}</p>
              </div>
              {preschool.admission && (
                <>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Verified Rating</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {parseFloat(preschool.admission.verified_rating) || 0 > 0
                        ? parseFloat(preschool.admission.verified_rating).toFixed(1)
                        : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="font-semibold">
                      {preschool.admission.total_reviews || 0}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <SchoolContactForm preschoolId={preschool.id} preschoolName={preschool.name} />
        </div>
      </div>
    </div>
  );
};
