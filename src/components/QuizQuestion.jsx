export default function QuizQuestion({ question, onAnswer }) {
  return (
    <div className="quiz-question">
      <h2 className="question-text">{question.question}</h2>
      <div className="answers-grid">
        {question.answers.map((answer, i) => (
          <button
            key={i}
            className="answer-btn"
            onClick={() => onAnswer(answer.tags)}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}
