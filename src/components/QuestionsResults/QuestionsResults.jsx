import { useLocation, useNavigate } from "react-router-dom";
import style from "./style.module.css";

// Composant affichant le resultat de la soumissions de notre quiz
export default function QuestionsResults() {
  const location = useLocation();
  const data = location.state;

  const correctAnswer = data.correctAnswer;
  const answerStatus = data.answerStatus;
  const questions = data.questions;

  // Calculer le nombre de réponse juste
  const numCorrectAnswers = answerStatus.reduce(
    (acc, answers, questionIndex) =>
      acc +
      answers.filter(
        (answer) =>
          answer.clicked && answer.value === correctAnswer[questionIndex]
      ).length,
    0
  );

  // Determiner la couleur basé sur le nombre de réponse correct
  let scoreColor;
  if (numCorrectAnswers <= 1) {
    scoreColor = "bgCase1";
  } else if (numCorrectAnswers <= 3) {
    scoreColor = "bgCase2";
  } else {
    scoreColor = "bgCase3";
  }

  function answerEvaluation(clicked, value, correctAnswer) {
    if (clicked && value === correctAnswer) {
      return style.correctAnswer;
    } else if (clicked && value !== correctAnswer) {
      return style.wrongAnswer;
    } else {
      return ""; // Return an empty string if no class should be applied
    }
  }

  // -------------------------------------- NAVIGATE TO RESULT PAGE WITH PARAMS --------------------------------------/
  // On créer une fonction pour faire un handleCreateNewQuiz du button Create a new quiz qui va permettre d'aller à la racine de notre app pour créer un nouveau quiz
  const navigate = useNavigate();

  // Function to handle navigation to the "/" path
  const handleCreateNewQuiz = () => {
    navigate("https://skoading.github.io/quizmaker"); // Navigate to the "/" path
  };

  return (
    <div>
      <ul>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <li>{question.question}</li>
            {answerStatus[questionIndex] &&
              answerStatus[questionIndex].map((answer, answerIndex) => (
                <button
                  key={answerIndex}
                  className={answerEvaluation(
                    answer.clicked,
                    answer.value,
                    correctAnswer[questionIndex]
                  )}
                >
                  {answer.value}
                </button>
              ))}
          </div>
        ))}
      </ul>

      <p className={`${style[scoreColor]}`}>
        You scored {numCorrectAnswers} out of {questions.length}
      </p>
      <button onClick={handleCreateNewQuiz}>Create a new quiz</button>
    </div>
  );
}
