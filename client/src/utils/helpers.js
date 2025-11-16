// Utility function to mask names for privacy
export const maskName = (name) => {
  if (!name || name.trim() === '') return 'Anonymous';
  
  const nameParts = name.trim().split(' ');
  if (nameParts.length === 0) return 'Anonymous';
  
  return nameParts.map(part => {
    if (part.length <= 2) {
      return part.charAt(0) + '*';
    } else if (part.length <= 4) {
      return part.charAt(0) + '*'.repeat(part.length - 1);
    } else {
      return part.charAt(0) + '*'.repeat(part.length - 2) + part.charAt(part.length - 1);
    }
  }).join(' ');
};

// Component for rendering modern stars
export const StarRating = ({ rating, maxRating = 5, size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'star-small' : size === 'large' ? 'star-large' : 'star-medium';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className={`star-rating ${sizeClass}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star star-filled">★</span>
      ))}
      {hasHalfStar && <span className="star star-half">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star star-empty">☆</span>
      ))}
    </span>
  );
};

