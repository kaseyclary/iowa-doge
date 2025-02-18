export const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value;
};

export const getAxisFontSize = () => {
  // Return smaller font size for mobile
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640 ? 10 : 12;
  }
  return 12; // Default size
}; 