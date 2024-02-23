import { useState } from "react";
import style from "./style.module.css";

// Composant permettant d'afficher les catégories
export default function Category({ categories, onSelectCategory }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  function handleSelectChange(e) {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);
    // Pour remonter l'état de selectedCategory vers le composant App.jsx on définit une fonction de rappel dans notre composant Category qui ransmettra la valeur de selectedCategory au composant parent (App.jsx).
    onSelectCategory(selectedValue); // Appel de la fonction de rappel avec la nouvelle valeur
  }

  return (
    <>
      <select
        className={style.categorySelect}
        name="categories"
        id="categorySelect"
        onChange={handleSelectChange}
      >
        <option value="">Select a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </>
  );
}
