import { useState } from "react";
import { TriviaAPI } from "../../api/trivia";
import QuestionsList from "../QuestionsList/QuestionsList";
import style from "./style.module.css";

// Composant permettant de créer le bouton d'envoi
export default function CreateButton({
  selectedCategory,
  selectedDifficulty,
  onSubmit,
}) {
  const [questions, setQuestions] = useState([]);

  // Fonction asynchrone pour récupérer les catégories disponibles via TriviaAPI se trouvant dans trivia.js
  async function fetchQuestions() {
    try {
      // On en profite ici pour passer en paramètre à la fonction la valeur des states ce qui permet à trivia d'y avoir accès
      const availableQuestions = await TriviaAPI.axiosQuestions(
        selectedCategory,
        selectedDifficulty
      );

      // Vérifier si le statut de la réponse est dans la plage 400 à 599
      if (availableQuestions.status >= 400 && availableQuestions.status < 600) {
        throw new Error(
          `Erreur ${availableQuestions.status}: Erreur de récupération des catégories`
        );
      }

      if (availableQuestions.length > 0) {
        // Si des questions sont disponibles, nous mettons à jour l'état local
        setQuestions(availableQuestions);
      }
    } catch (error) {
      alert("Il y a eu une erreur réseau 😵‍💫 Désolé!" + error.message);
    }
  }

  return (
    <>
      <button
        className={style.createBtn}
        id="createBtn"
        onClick={fetchQuestions}
      >
        Create
      </button>
      <div>
        <QuestionsList questions={questions} onSubmit={onSubmit} />
      </div>
    </>
  );
}
