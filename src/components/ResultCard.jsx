import { results } from "../data/results";

export default function ResultCard({ cuisineKey }) {
  const result = results[cuisineKey];
  if (!result) return null;

  return (
    <div className="result-card">
      <div className="result-emoji">{result.emoji}</div>
      <h2 className="result-name">{result.name}</h2>
      <p className="result-tagline">{result.tagline}</p>
      <p className="result-area">{result.area}</p>
    </div>
  );
}
