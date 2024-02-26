import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ajout de useNavigate pour pouvoir utiliser l'historique de navigation
import style from "./style.module.css";

// Composant affichant une liste comprenant les questions et les réponses
export default function QuestionsList({ questions }) {
  // -------------------------------------- USE STATE--------------------------------------/
  const [highlightedButtons, setHighlightedButtons] = useState([]);
  // Populer les états avec les questions
  const [allAnswers, setAllAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  // On vérifie qu'on a bien reçu toutes les réponses à toutes les questions
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  // Utilisez l'état pour stocker l'état de chaque bouton de réponse
  const [answerStatus, setAnswerStatus] = useState([]);

  // -------------------------------------- USE EFFECT--------------------------------------/
  useEffect(() => {
    // Populer le tableau allAnswers et définissez la valeur dans l'état
    const newAllAnswers = questions.map((question) => [
      question.correct_answer,
      ...question.incorrect_answers,
    ]);

    // Extraire les réponses correctes séparément et définir la valeur dans l'état
    const newCorrectAnswers = questions.map(
      (question) => question.correct_answer
    );
    setCorrectAnswer(newCorrectAnswers);

    // Extraire les réponses incorrectes séparément et définissez la valeur dans l'état
    const newIncorrectAnswers = questions.map(
      (question) => question.incorrect_answers
    );
    setIncorrectAnswers(newIncorrectAnswers);

    // Mélanger les réponses une seule fois lorsqu'elles sont initialement définies
    shuffleAnswers(newAllAnswers);
    // Définir les réponses mélangées dans l'état
    setAllAnswers(newAllAnswers);

    // Ajoutez une propriété d'état au tableau newAllAnswer car nous l'utiliserons pour changer l'état en vrai lorsque nous cliquons dessus
    // Créer un tableau d'état de réponse avec les valeurs par défaut
    const AllAnswersWithStatus = newAllAnswers.map((answers) =>
      answers.map((answer) => ({ value: answer, clicked: false }))
    );

    setAnswerStatus(AllAnswersWithStatus);
  }, [questions]);

  // -------------------------------------- SHUFFLE FUNCTION --------------------------------------/
  const shuffleAnswers = (allAnswers) => {
    allAnswers.forEach((subArray) => {
      for (let i = subArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [subArray[i], subArray[j]] = [subArray[j], subArray[i]];
      }
    });
  };

  // -------------------------------------- HIGHLIGHT ONE BUTTON SYSTEM --------------------------------------/
  // Fonction pour gérer le clic sur un bouton
  const handleButtonClick = (questionIndex, answerIndex) => {
    // Avant de modifier l'état la fonction crée une copie de cet état en utilisant l'opérateur de propagation (...). Cela garantit que l'on ne modifie pas directement l'état actuel (ce qui est une bonne pratique en React pour éviter les mutations d'état).
    const updatedHighlightedButtons = [...highlightedButtons];
    //La fonction vérifie d'abord s'il existe déjà un tableau pour la question spécifique dans highlightedButtons. Si ce n'est pas le cas, elle initialise un tableau vide à cet index. Cela garantit qu'il y a un tableau pour chaque question dans highlightedButtons, où chaque élément du tableau correspond à un bouton de réponse.
    updatedHighlightedButtons[questionIndex] =
      updatedHighlightedButtons[questionIndex] || []; // S'assurez qu'il existe un tableau pour cette question
    //Ensuite, la fonction met à jour le tableau highlightedButtons pour marquer le bouton qui a été cliqué. Elle le fait en définissant true à l'index correspondant dans le tableau de la question. Ainsi, highlightedButtons[questionIndex][answerIndex] devient true pour le bouton qui a été cliqué.
    updatedHighlightedButtons[questionIndex][answerIndex] = true; // Marquez le bouton comme cliqué
    //Une fois que le tableau highlightedButtons est mis à jour pour refléter le bouton cliqué, la fonction met à jour l'état en appelant setHighlightedButtons avec la copie mise à jour du tableau.
    setHighlightedButtons(updatedHighlightedButtons); // Met à jour l'état

    // On vérifie qu'on a bien un tableau de longeur 5, ce qui veut dire qu'on a répondu à toutes les questions et on change le state
    if (updatedHighlightedButtons.length === 5) {
      setAllQuestionsAnswered(true);
    }

    // Cette partie gère le statut courant des réponse afin d'avoir un tableau à jour ce ce qui a été cliquer ou pas
    // On commence par créer une copie de answerStatus
    const updatedAnswerStatus = [...answerStatus];
    // Basculer l'état cliqué du bouton de réponse sélectionné
    updatedAnswerStatus[questionIndex][answerIndex].clicked =
      !updatedAnswerStatus[questionIndex][answerIndex].clicked;
    // Mettre à jour l'état de la réponse
    setAnswerStatus(updatedAnswerStatus);
  };
  // -------------------------------------- NAVIGATE TO RESULT PAGE WITH PARAMS --------------------------------------/
  // On créer une fonction pour faire un handleSubmit du button createButton qui va permettre d'aller à la page resultat
  const navigate = useNavigate();
  // Données que nous voulons transmettre via la navigation
  const data = {
    correctAnswer: correctAnswer,
    answerStatus: answerStatus,
    questions: questions,
  };

  // Fonction pour gérer la soumission du formulaire
  const handleClick = () => {
    // Après la soumission, accédez à la page de résultats avec les réponses des utilisateurs
    navigate("/result", { state: data });
  };

  return (
    <>
      <ul>
        {questions.map((question, questionIndex) => (
          <div className={style.qAndAWrapper} key={questionIndex}>
            <li className={style.answerList}>{question.question}</li>
            {/* On utilise map ici pour créer les boutons et on s'assure d'abord que allAnswer existe bien en ajoutant la vérification conditionnelle allAnswers[questionIndex] &&, pour s'assurer que map n'est appelée que sur allAnswers[questionIndex] si il n'est pas définis. */}
            {allAnswers[questionIndex] &&
              allAnswers[questionIndex].map((answer, answerIndex) => (
                <button
                  key={answerIndex}
                  className={
                    highlightedButtons[questionIndex] &&
                    highlightedButtons[questionIndex][answerIndex]
                      ? style.highlighted
                      : ""
                  }
                  onClick={() => handleButtonClick(questionIndex, answerIndex)}
                >
                  {answer}
                </button>
              ))}
          </div>
        ))}
      </ul>
      {allQuestionsAnswered && (
        <button className={style.submitBtn} onClick={handleClick}>
          Submit
        </button>
      )}
    </>
  );
}
