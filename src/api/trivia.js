import axios from "axios";
import { CATEGORY_LIST } from "../config.js";

// Création d'une class avec des fonctions statiques qui fait une requete axios à l'api afin de récupérer les données nécessaire

export class TriviaAPI {
  // Requête pour récupérer les catégories disponibles pour pouvoir les affichers
  static async axiosCategories() {
    const response = await axios.get(CATEGORY_LIST);

    return response.data.trivia_categories;
  }
  // Requête pour récupérer les questions et réponses de la catégories et difficulté sélectionné
  static async axiosQuestions(selectedCategory, selectedDifficulty) {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=5&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`
    );

    return response.data.results;
  }
}
