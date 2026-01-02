export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateAnnualCost = (admission) => {
  const monthly = admission?.monthly_fee || 0;
  const annual = admission?.annual_fee || 0;
  const registration = admission?.registration_fee || 0;
  return monthly * 12 + annual + registration;
};

export const renderStars = (rating) => {
  const stars = [];
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < filledStars) {
      stars.push('★');
    } else if (i === filledStars && hasHalfStar) {
      stars.push('☆');
    } else {
      stars.push('☆');
    }
  }

  return stars.join('');
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-preschool.jpg';
  return imageUrl;
};

export const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const convertToJSON = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

export const exportToCSV = (data, filename) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const convertToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  const csvRows = data.map((row) =>
    headers.map((header) => `"${row[header] || ''}"`).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};
