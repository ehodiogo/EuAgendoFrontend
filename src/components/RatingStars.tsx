import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

interface RatingStarsProps {
  score: number;
  ratingCount: number;
  size?: number;
  color?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  score,
  ratingCount,
  size = 16,
  color = '#FFC107'
}) => {
  const stars = [];
  const normalizedScore = Math.max(0, Math.min(5, score));

  for (let i = 1; i <= 5; i++) {
    if (normalizedScore >= i) {
      stars.push(<FaStar key={i} size={size} color={color} />);
    } else if (normalizedScore >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color={color} />);
    } else {
      // Estrela vazia
      stars.push(<FaRegStar key={i} size={size} color={color} />);
    }
  }

  return (
    <div className="d-flex align-items-center rating-container">
      <div className="stars-list me-2" style={{ display: 'flex', gap: '2px' }}>
        {stars}
      </div>
      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
        ({ratingCount} {ratingCount === 1 ? 'Avaliação' : 'Avaliações'})
      </span>
    </div>
  );
};

export default RatingStars;