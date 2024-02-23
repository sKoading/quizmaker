import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Category from "./components/Category/Category";
import CreateButton from "./components/CreateButton/CreateButton";
import Difficulty from "./components/Difficulty/Difficulty";
import Title from "./components/Title/Title";
import { TriviaAPI } from "./api/trivia.js";

import QuestionsResults from "./components/QuestionsResults/QuestionsResults.jsx";

function App() {
  /* ----------- USESTATES ----------- */

  // Va stoquer les catégories récupérer en faisant un appel à l'api
  const [categories, setCategories] = useState([]);
  // Va stoquer la catégorie selectionner et va être mis à jour dans le composant Category.jsx dans que la selection change
  const [selectedCategory, setSelectedCategory] = useState("");
  // Va stoquer la difficulté
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  /* ----------- FUNCTIONS ----------- */

  //On reçoit la valeur mise à jour de selectedCategory et on met à jour l'état
  function handleCategoryChange(selectedValueCategory) {
    setSelectedCategory(selectedValueCategory); // Mise à jour de l'état selectedCategory avec la valeur du state selectedValue trouvé dans le composant category
  }

  function handleDifficultyChange(selectedValueDifficulty) {
    setSelectedDifficulty(selectedValueDifficulty);
  }

  // Le useEffect ici sert à s'assurer que la fonctionner ne sera exécuter qu'une seule fois
  useEffect(() => {
    // Fonction asynchrone pour récupérer les catégories disponibles via TriviaAPI se trouvant dans trivia.js
    async function fetchCategories() {
      try {
        const availableCategories = await TriviaAPI.axiosCategories();

        // Vérifier si le statut de la réponse est dans la plage 400 à 599
        if (
          availableCategories.status >= 400 &&
          availableCategories.status < 600
        ) {
          throw new Error(
            `Erreur ${availableCategories.status}: Erreur de récupération des catégories`
          );
        }

        if (availableCategories.length > 0) {
          // Si des catégories sont disponibles, nous mettons à jour l'état local
          setCategories(availableCategories);
        }
      } catch (error) {
        alert("Il y a eu une erreur réseau 😵‍💫 Désolé!" + error.message);
      }
    }
    // Appel de la fonction pour récupérer les catégories
    fetchCategories();
  }, []); //On s'assure de passer un tableau vide en tant que deuxième argument pour exécuter useEffect une seule fois après le montage initial

  /* ----------- RETURN ----------- */
  // Un routeur à été mis en place autour de App dans main.jsx afin de pouvoir dessiner les deux routes nécessaires
  return (
    <div>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Title />
              <Category
                categories={categories}
                onSelectCategory={handleCategoryChange}
              />
              <Difficulty onHandleDifficultyChange={handleDifficultyChange} />
              <CreateButton
                selectedCategory={selectedCategory}
                selectedDifficulty={selectedDifficulty}
              />
            </>
          }
        />
        <Route path="/result" element={<QuestionsResults />} />
      </Routes>
    </div>
  );
}

export default App;
