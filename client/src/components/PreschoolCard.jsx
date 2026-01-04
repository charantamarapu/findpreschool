import React, { useContext } from 'react';
import { Minus, Plus, MapPin, Phone, Globe, Star, ExternalLink, Calendar, Navigation } from 'lucide-react';
import { ComparisonContext } from '../context/ComparisonContext';
import { formatCurrency } from '../utils/helpers';

export const PreschoolCard = ({ preschool, onViewDetails, viewMode = 'grid' }) => {
  const { addToComparison, removeFromComparison, selectedPreschools } =
    useContext(ComparisonContext);
  const isSelected = selectedPreschools.some((p) => p.id === preschool.id);

  const primaryImage =
    preschool.images?.find((img) => img.is_primary)?.image_url ||
    preschool.images?.[0]?.image_url;
  const monthlyFeeMin = preschool.admission?.monthly_fee_min;
  const monthlyFeeMax = preschool.admission?.monthly_fee_max;
  const rating = parseFloat(preschool.admission?.verified_rating) || 0;

  // Distance from nearby search (in km)
  const distance = preschool.distance ? parseFloat(preschool.distance) : null;

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100/50 group hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={preschool.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MapPin size={48} strokeWidth={1} />
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {preschool.verified_status && (
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
              {distance !== null && (
                <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                  <Navigation size={12} />
                  {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)} km`}
                </span>
              )}
            </div>
            {rating > 0 && (
              <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Star size={14} className="text-amber-400" fill="currentColor" />
                <span className="font-bold text-sm">{rating.toFixed(1)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {preschool.name}
          </h3>

          {/* Location & Established */}
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {preschool.city || 'Location N/A'}
            </span>
            {preschool.established_year && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Since {preschool.established_year}
                </span>
              </>
            )}
          </div>

          {/* Reviews */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({preschool.admission?.total_reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Fee */}
          {(monthlyFeeMin || monthlyFeeMax) && (
            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100/50">
              <p className="text-xs text-gray-500 mb-0.5">Monthly Fee</p>
              <p className="text-lg font-bold text-primary-600">
                {monthlyFeeMin && monthlyFeeMax
                  ? `${formatCurrency(monthlyFeeMin)} - ${formatCurrency(monthlyFeeMax)}`
                  : monthlyFeeMin
                    ? `From ${formatCurrency(monthlyFeeMin)}`
                    : `Up to ${formatCurrency(monthlyFeeMax)}`
                }
              </p>
            </div>
          )}

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {preschool.phone && (
              <a
                href={`tel:${preschool.phone}`}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Phone size={12} />
                Call
              </a>
            )}
            {preschool.website && (
              <a
                href={preschool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe size={12} />
                Website
              </a>
            )}
            {(preschool.google_map_url || (preschool.latitude && preschool.longitude)) && (
              <a
                href={preschool.google_map_url || `https://www.google.com/maps/search/?api=1&query=${preschool.latitude},${preschool.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink size={12} />
                Map
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => onViewDetails(preschool.id)}
              className="flex-1 btn-primary text-sm py-2.5"
            >
              View Details
            </button>
            <button
              onClick={() =>
                isSelected
                  ? removeFromComparison(preschool.id)
                  : addToComparison(preschool)
              }
              className={`flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 border-2 ${isSelected
                ? 'bg-secondary-500 border-secondary-500 text-white shadow-lg shadow-secondary-500/30'
                : 'bg-white border-gray-200 text-gray-500 hover:border-secondary-500 hover:text-secondary-500'
                }`}
              title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
            >
              {isSelected ? <Minus size={20} /> : <Plus size={20} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100/50 group">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={preschool.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MapPin size={48} strokeWidth={1} />
            </div>
          )}

          {preschool.verified_status && (
            <span className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors">
                {preschool.name}
              </h3>
              {rating > 0 && (
                <span className="bg-primary-50 px-3 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0">
                  <Star size={16} className="text-amber-400" fill="currentColor" />
                  <span className="font-bold text-primary-700">{rating.toFixed(1)}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {preschool.address || preschool.city || 'Location N/A'}
              </span>
              {preschool.established_year && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>Est. {preschool.established_year}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {preschool.phone && (
                <a
                  href={`tel:${preschool.phone}`}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Phone size={14} />
                  {preschool.phone}
                </a>
              )}
              {preschool.website && (
                <a
                  href={preschool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Globe size={14} />
                  Website
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
            {/* Fee */}
            {(monthlyFeeMin || monthlyFeeMax) && (
              <div>
                <p className="text-xs text-gray-500">Monthly Fee</p>
                <p className="text-lg font-bold text-primary-600">
                  {monthlyFeeMin && monthlyFeeMax
                    ? `${formatCurrency(monthlyFeeMin)} - ${formatCurrency(monthlyFeeMax)}`
                    : monthlyFeeMin
                      ? `From ${formatCurrency(monthlyFeeMin)}`
                      : `Up to ${formatCurrency(monthlyFeeMax)}`
                  }
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  isSelected
                    ? removeFromComparison(preschool.id)
                    : addToComparison(preschool)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border-2 text-sm font-medium ${isSelected
                  ? 'bg-secondary-500 border-secondary-500 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-secondary-500 hover:text-secondary-500'
                  }`}
              >
                {isSelected ? <Minus size={16} /> : <Plus size={16} />}
                {isSelected ? 'Remove' : 'Compare'}
              </button>
              <button
                onClick={() => onViewDetails(preschool.id)}
                className="btn-primary text-sm px-6"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
