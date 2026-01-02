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
  const monthlyFee = preschool.admission?.monthly_fee;
  const rating = parseFloat(preschool.admission?.verified_rating) || 0;

  return (
    <div className="card p-4 rounded-lg overflow-hidden">
      {/* Image Section */}
      <div className="relative mb-4 h-48 bg-gray-200 rounded-lg overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={preschool.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            No Image
          </div>
        )}
        {preschool.verified_status && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{preschool.name}</h3>

        {/* Rating and Reviews */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(Math.round(rating))].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({preschool.admission?.total_reviews || 0}{' '}
              reviews)
            </span>
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
        </div>

        {/* Fee */}
        {monthlyFee && (
          <div className="mb-4 p-2 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Fee</p>
            <p className="text-lg font-bold text-primary-600">
              {formatCurrency(monthlyFee)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(preschool.id)}
            className="flex-1 btn-primary text-sm py-2"
          >
            View Details
          </button>
          <button
            onClick={() =>
              isSelected
                ? removeFromComparison(preschool.id)
                : addToComparison(preschool)
            }
            className={`px-3 py-2 rounded-lg font-medium transition-colors border-2 ${
              isSelected
                ? 'bg-secondary-500 border-secondary-500 text-white'
                : 'border-gray-300 text-gray-600 hover:border-secondary-500'
            }`}
            title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isSelected ? (
              <Minus size={20} />
            ) : (
              <Plus size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
