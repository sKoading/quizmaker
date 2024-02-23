import { useState } from "react";
import style from "./style.module.css";
// Composant permettant de selectionner la difficulté
export default function Difficulty({ onHandleDifficultyChange }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  function handleSelectChange(e) {
    const selectedValue = e.target.value;
    setSelectedDifficulty(selectedValue);
    onHandleDifficultyChange(selectedValue);
  }
  return (
    <>
      <select
        className={style.difficultySelect}
        name="difficulties"
        id="difficultySelect"
        onChange={handleSelectChange}
      >
        <option value="">Select difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </>
  );
}
