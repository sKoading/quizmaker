import axios from "axios";
import { CATEGORY_LIST } from "../config.js";

/*
L'apparition de " et &#039; dans la sortie de l' API suggère que l'API code certains caractères en entités HTML. 
C'est une pratique courante pour garantir que les caractères spéciaux sont correctement transmis sur le Web.

Lorsque l'on récupère les données de l'API à l'aide d'axios, elle renvoie la réponse sous forme de chaîne,
 y compris toutes les entités HTML codées dans le corps de la réponse. La bibliothèque axios ne décode pas 
 automatiquement les entités HTML dans la réponse. Il faut donc créer une fonction pour le faire.
*/

// Cette fonction s'appelle decodeHtmlEntities et prend un paramètre de chaîne appelé html,
// qui représente une chaîne contenant des entités HTML qui doivent être décodées.
function decodeHtmlEntities(html) {
  // Créez un nouvel élément <textarea> à l'aide de la méthode document.createElement.
  // Un élément <textarea> est choisi car il peut contenir du contenu HTML et il décode automatiquement les entités HTML lorsqu'il est affecté comme innerHTML.
  let txt = document.createElement("textarea");

  // Attribue la chaîne HTML d'entrée (html) à la propriété innerHTML de l'élément <textarea>.
  // Lorsque qu'on définit innerHTML, le navigateur décode automatiquement les entités HTML.
  txt.innerHTML = html;

  // Renvoie la propriété value de l'élément <textarea>, qui contient la chaîne HTML décodée.
  // Cette valeur est la version décodée de la chaîne HTML d'entrée d'origine.
  return txt.value;
}

// Classe TriviaAPI avec des méthodes statiques pour effectuer des requêtes API
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

    // Décoder les entités HTML dans les données de réponse
    // On crée une nouvelle liste d'objets décodés en parcourant chaque résultat dans la liste initiale
    const decodedResults = response.data.results.map((result) => ({
      ...result, // On déstructure l'objet 'result' pour conserver toutes ses propriétés
      question: decodeHtmlEntities(result.question), // On décode l'entité HTML dans la question en utilisant la fonction 'decodeHtmlEntities'
      incorrect_answers: result.incorrect_answers.map(
        (
          answer // On parcourt la liste des réponses incorrectes de chaque résultat et on décode chaque réponse
        ) => decodeHtmlEntities(answer)
      ),
      // On décode la réponse correcte de chaque résultat
      correct_answer: decodeHtmlEntities(result.correct_answer),
    }));

    return decodedResults;
  }
}
