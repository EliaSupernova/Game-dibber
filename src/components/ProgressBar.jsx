export default function ProgressBar({ current, total }) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-text">
        Question {current + 1} of {total}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
