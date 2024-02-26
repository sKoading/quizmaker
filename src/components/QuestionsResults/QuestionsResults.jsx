import { useLocation, useNavigate } from "react-router-dom";
import style from "./style.module.css";

// Composant affichant le resultat de la soumissions de notre quiz
export default function QuestionsResults() {
  const location = useLocation();
  const data = location.state;

  const correctAnswer = data.correctAnswer;
  const answerStatus = data.answerStatus;
  const questions = data.questions;

  // On utilise la méthode reduce pour calculer le nombre total de réponses correctes
  // Pour chaque question, on filtre les réponses pour ne garder que celles qui ont été cliquées et dont la valeur correspond à la réponse correcte.
  // On compte le nombre de réponses correctes pour chaque question et on les ajoute à l'accumulateur.
  // À la fin, on obtient le nombre total de réponses correctes dans numCorrectAnswers.
  const numCorrectAnswers = answerStatus.reduce(
    // La fonction de rappel prend quatre paramètres : acc (accumulateur), answers (élément courant), questionIndex (indice de la question)

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

  // Fonction answerEvaluation pour déterminer la classe CSS à appliquer à un bouton de réponse en fonction de sa valeur et de sa conformité à la réponse correcte
  function answerEvaluation(clicked, value, correctAnswer) {
    // Si le bouton a été cliqué ou pas et que sa valeur correspond à la réponse correcte, on renvoie la classe CSS pour une réponse correcte
    if (value === correctAnswer) {
      return style.correctAnswer;
    }
    // Si le bouton a été cliqué mais sa valeur ne correspond pas à la réponse correcte, on renvoie la classe CSS pour une réponse incorrecte
    else if (clicked && value !== correctAnswer) {
      return style.wrongAnswer;
    }
    // Si le bouton n'a pas été cliqué, on ne renvoie aucune classe CSS (une chaîne vide) car aucune classe ne doit être appliquée
    else {
      return ""; // Return an empty string if no class should be applied
    }
  }

  // -------------------------------------- NAVIGATE TO RESULT PAGE WITH PARAMS --------------------------------------/
  // On créer une fonction pour faire un handleCreateNewQuiz du button Create a new quiz qui va permettre d'aller à la racine de notre app pour créer un nouveau quiz
  const navigate = useNavigate();

  // Function to handle navigation to the "/" path
  const handleCreateNewQuiz = () => {
    navigate("/quizmaker"); // Navigate to the "/" path
  };

  return (
    <div>
      <ul>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <li className={style.answerList}>{question.question}</li>
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

      <p className={`${style.score} ${style[scoreColor]}`}>
        You scored {numCorrectAnswers} out of {questions.length}
      </p>
      <button className={style.newQuizBtn} onClick={handleCreateNewQuiz}>
        Create a new quiz
      </button>
    </div>
  );
}
