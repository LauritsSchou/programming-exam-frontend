import React, { useState, useEffect } from "react";
import { createAthlete, updateAthlete } from "../apiFacade";
import { Athlete } from "../interfaces/athleteInterface";
import { Discipline } from "../interfaces/disciplineInterface";
import { getDisciplines } from "../apiFacade";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/athlete-form.css";

interface AthleteFormProps {
  onSubmit: (athlete: Athlete) => void;
  athlete: Athlete | null;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ onSubmit, athlete }) => {
  const defaultFormObj: Athlete = {
    id: undefined,
    name: "",
    age: 0,
    gender: "",
    club: "",
    disciplines: [],
    results: [],
  };

  const [formData, setFormData] = useState<Athlete>(athlete || defaultFormObj);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(athlete || defaultFormObj);
    fetchDisciplines();
  }, [athlete]);

  const fetchDisciplines = async () => {
    try {
      const disciplines = await getDisciplines();
      setAllDisciplines(disciplines);
    } catch (error) {
      console.error("Error fetching disciplines:", error);
      toast.error("Failed to fetch disciplines");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      let savedAthlete;
      if (formData.id) {
        savedAthlete = await updateAthlete(formData.id, formData);
      } else {
        savedAthlete = await createAthlete(formData);
      }
      onSubmit(savedAthlete);
      setFormData(defaultFormObj);
      toast.success("Athlete saved successfully");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error saving athlete:", error);
      toast.error("Failed to save athlete");
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name || !formData.age || !formData.gender || !formData.club) {
      errors.push("Please fill out all fields.");
    }

    if (isNaN(Number(formData.age)) || Number(formData.age) < 6) {
      errors.push("Age must be a number and minimum 6 years old.");
    }

    if (formData.disciplines.length === 0) {
      errors.push("Please select at least one discipline.");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "age" && isNaN(Number(value))) {
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const disciplineId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      const disciplineToAdd = allDisciplines.find((discipline) => discipline.id === disciplineId);
      if (disciplineToAdd) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          disciplines: [...prevFormData.disciplines, disciplineToAdd],
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        disciplines: prevFormData.disciplines.filter((discipline) => discipline.id !== disciplineId),
      }));
    }
  };

  return (
    <div className="athlete-form-page">
      <h2 className="athlete-header">{formData.id ? "Edit Athlete" : "Add New Athlete"}</h2>
      <div className="athlete-form-container">
        <form className="athlete-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <label>
            Age:
            <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Club:
            <input type="text" name="club" value={formData.club} onChange={handleInputChange} />
          </label>
          <div className="disciplines-section">
            <h3>Disciplines:</h3>
            {allDisciplines.map((discipline) => (
              <label key={discipline.id}>
                <input type="checkbox" name={`discipline_${discipline.id}`} value={discipline.id} checked={formData.disciplines.some((d) => d.id === discipline.id)} onChange={handleDisciplineChange} />
                {discipline.name}
              </label>
            ))}
          </div>
          <div className="form-errors">
            {formErrors.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
          <button type="submit">Save Athlete</button>
        </form>
      </div>
    </div>
  );
};

export default AthleteForm;
