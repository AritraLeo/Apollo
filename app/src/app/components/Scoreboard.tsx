import React from 'react';

interface ScoreboardProps {
  image: string;
  score: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ image, score }) => {
  return (
    <div className="scoreboard bg-blue text-white p-4">
      {image && <img src={image} alt="Captured image" className="mb-4" />}
      {score !== null && <p className="text-xl">Golden Ratio Score: {score.toFixed(2)}</p>}
    </div>
  );
};

export default Scoreboard;
