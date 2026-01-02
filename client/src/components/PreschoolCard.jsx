import React, { useState, useContext } from 'react';
import { Minus, Plus, MapPin, Phone, Globe, Mail, Star } from 'lucide-react';
import { ComparisonContext } from '../context/ComparisonContext';
import { formatCurrency } from '../utils/helpers';

export const PreschoolCard = ({ preschool, onViewDetails }) => {
  const { addToComparison, removeFromComparison, selectedPreschools } =
    useContext(ComparisonContext);
  const isSelected = selectedPreschools.some((p) => p.id === preschool.id);

  const primaryImage =
    preschool.images?.find((img) => img.is_primary)?.image_url ||
    preschool.images?.[0]?.image_url;
  const monthlyFeeMin = preschool.admission?.monthly_fee_min;
  const monthlyFeeMax = preschool.admission?.monthly_fee_max;
  const rating = parseFloat(preschool.admission?.verified_rating) || 0;

  return (
    <div className="card p-4 overflow-hidden transform hover:-translate-y-1 transition-transform">
      {/* Image Section */}
      <div className="relative mb-4 h-48 bg-gray-200 rounded-md overflow-hidden shadow-sm">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={preschool.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-sm">
            No Image
          </div>
        )}
        {preschool.verified_status && (
          <div className="absolute top-3 right-3 bg-white text-green-600 px-2 py-1 rounded-full text-xs font-semibold shadow">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{preschool.name}</h3>

        {/* Established Year and Rating */}
        <div className="flex items-center justify-between mb-3">
          {preschool.established_year && (
            <span className="text-xs text-gray-500 italic">
              Since {preschool.established_year}
            </span>
          )}
          {rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(Math.round(rating))].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Rating Details */}
        {rating > 0 && (
          <div className="text-xs text-gray-600 mb-3">
            {preschool.admission?.total_reviews || 0} reviews
          </div>
        )}

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={16} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{preschool.address || 'Address not available'}</span>
        </div>

        {/* Contact */}
        <div className="space-y-1 mb-3 text-sm">
          {preschool.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} />
              <a href={`tel:${preschool.phone}`} className="hover:text-primary-600">
                {preschool.phone}
              </a>
            </div>
          )}
          {preschool.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={16} />
              <a
                href={preschool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 truncate"
              >
                Website
              </a>
            </div>
          )}

          {/* Google Maps Link */}
          {preschool.google_map_url ? (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <a href={preschool.google_map_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 truncate">Open in Maps</a>
            </div>
          ) : (preschool.latitude && preschool.longitude) ? (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <a href={`https://www.google.com/maps/search/?api=1&query=${preschool.latitude},${preschool.longitude}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 truncate">Open Coordinates</a>
            </div>
          ) : null
        }
        </div>

        {/* Fee */}
        {(monthlyFeeMin || monthlyFeeMax) && (
          <div className="mb-4 p-2 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Fee</p>
            <p className="text-lg font-bold text-primary-600">
              {monthlyFeeMin && monthlyFeeMax
                ? `₹${formatCurrency(monthlyFeeMin)} - ₹${formatCurrency(monthlyFeeMax)}`
                : monthlyFeeMin 
                  ? `₹${formatCurrency(monthlyFeeMin)}`
                  : `₹${formatCurrency(monthlyFeeMax)}`
              }
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 items-center">
          <button
            onClick={() => onViewDetails(preschool.id)}
            className="flex-1 btn-outline text-sm py-2"
          >
            View Details
          </button>
          <button
            onClick={() =>
              isSelected
                ? removeFromComparison(preschool.id)
                : addToComparison(preschool)
            }
            className={`inline-flex items-center justify-center h-10 w-10 rounded-lg transition-colors border ${isSelected ? 'bg-secondary-500 border-secondary-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-secondary-50 hover:border-secondary-500'}`}
            title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isSelected ? <Minus size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
