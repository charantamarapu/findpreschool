import React, { useContext } from 'react';
import { X, Download } from 'lucide-react';
import { ComparisonContext } from '../context/ComparisonContext';
import { formatCurrency, calculateAnnualCost } from '../utils/helpers';

export const ComparisonPanel = ({ comparisonData }) => {
  const { selectedPreschools, removeFromComparison, clearComparison } =
    useContext(ComparisonContext);

  if (selectedPreschools.length === 0) return null;

  const handleExportCSV = () => {
    const csvData = comparisonData.map((p) => ({
      'Preschool Name': p.name,
      'Monthly Fee': p.admission?.monthly_fee_min && p.admission?.monthly_fee_max
        ? `₹${p.admission.monthly_fee_min} - ₹${p.admission.monthly_fee_max}`
        : p.admission?.monthly_fee_min || p.admission?.monthly_fee_max || 'N/A',
      'Annual Fee': p.admission?.annual_fee_min && p.admission?.annual_fee_max
        ? `₹${p.admission.annual_fee_min} - ₹${p.admission.annual_fee_max}`
        : p.admission?.annual_fee_min || p.admission?.annual_fee_max || 'N/A',
      'Registration Fee': p.admission?.registration_fee || 'N/A',
      'Rating': p.admission?.verified_rating || 'N/A',
      'Reviews': p.admission?.total_reviews || 0,
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map((row) =>
        headers.map((h) => `"${row[h]}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preschool-comparison.csv';
    a.click();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary-600 shadow-2xl max-h-96 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Comparing {selectedPreschools.length} Preschools
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 btn-secondary text-sm"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={clearComparison}
              className="btn-outline text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2">
              <tr>
                <th className="text-left p-2 font-bold">Preschool</th>
                {comparisonData.map((p) => (
                  <th key={p.id} className="text-left p-2 min-w-max">
                    <div className="flex justify-between items-start">
                      <span className="font-bold line-clamp-2 max-w-xs">
                        {p.name}
                      </span>
                      <button
                        onClick={() => removeFromComparison(p.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Monthly Fee */}
              <tr className="border-b">
                <td className="p-2 font-semibold">Monthly Fee</td>
                {comparisonData.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.admission?.monthly_fee_min && p.admission?.monthly_fee_max
                      ? `₹${formatCurrency(p.admission.monthly_fee_min)} - ₹${formatCurrency(p.admission.monthly_fee_max)}`
                      : p.admission?.monthly_fee_min || p.admission?.monthly_fee_max
                        ? `₹${formatCurrency(p.admission.monthly_fee_min || p.admission.monthly_fee_max)}`
                        : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Annual Fee */}
              <tr className="border-b bg-gray-50">
                <td className="p-2 font-semibold">Annual Fee</td>
                {comparisonData.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.admission?.annual_fee_min && p.admission?.annual_fee_max
                      ? `₹${formatCurrency(p.admission.annual_fee_min)} - ₹${formatCurrency(p.admission.annual_fee_max)}`
                      : p.admission?.annual_fee_min || p.admission?.annual_fee_max
                        ? `₹${formatCurrency(p.admission.annual_fee_min || p.admission.annual_fee_max)}`
                        : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Registration Fee */}
              <tr className="border-b">
                <td className="p-2 font-semibold">Registration Fee</td>
                {comparisonData.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.admission?.registration_fee
                      ? formatCurrency(p.admission.registration_fee)
                      : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Total Annual Cost */}
              <tr className="border-b bg-primary-50">
                <td className="p-2 font-bold text-primary-700">
                  Total Annual Cost
                </td>
                {comparisonData.map((p) => (
                  <td key={p.id} className="p-2 font-bold text-primary-700">
                    {formatCurrency(calculateAnnualCost(p.admission))}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b">
                <td className="p-2 font-semibold">Verified Rating</td>
                {comparisonData.map((p) => {
                  const rating = p.admission?.verified_rating ? parseFloat(p.admission.verified_rating) : 0;
                  return (
                    <td key={p.id} className="p-2">
                      {rating > 0 ? `${rating.toFixed(1)} ⭐` : 'No rating'}
                    </td>
                  );
                })}
              </tr>

              {/* Reviews */}
              <tr>
                <td className="p-2 font-semibold">Total Reviews</td>
                {comparisonData.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.admission?.total_reviews || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
