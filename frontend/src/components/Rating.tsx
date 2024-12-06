import React from "react";
import { FaStar } from "react-icons/fa";

type RatingProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          filled={i < value}
          onClick={() => handleClick(i + 1)}
        />
      ))}
    </div>
  );
};

type StarIconProps = {
  filled: boolean;
  onClick: () => void;
};

const StarIcon: React.FC<StarIconProps> = ({ filled, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer hover:scale-110 transition-transform"
  >
    {filled ? (
      <FaStar className="text-yellow-500 w-6 h-6" />
    ) : (
      <FaStar className="text-gray-400 w-6 h-6" />
    )}
  </div>
);
