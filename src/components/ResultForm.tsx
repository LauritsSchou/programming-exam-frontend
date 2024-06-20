import React, { useState, useEffect } from "react";
import { createResult, updateResult } from "../apiFacade";
import { Result } from "../interfaces/resultInterface";
import { Discipline } from "../interfaces/disciplineInterface";
import { getDisciplines } from "../apiFacade";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/result-form.css";

interface ResultFormProps {
  onSubmit: (result: Result) => void;
  result: Result | null;
}

const ResultForm: React.FC<ResultFormProps> = ({ onSubmit, result }) => {
  const defaultFormObj: Result = {
    id: undefined,
    resultType: "",
    date: "",
    resultValue: "",
    discipline: { id: 0, name: "", resultType: "" },
  };

  const [formData, setFormData] = useState<Result>(result || defaultFormObj);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(result || defaultFormObj);
    fetchDisciplines();
  }, [result]);

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

    // Perform validation checks
    if (!validateForm()) {
      return;
    }

    try {
      let savedResult;
      if (formData.id) {
        savedResult = await updateResult(formData.id, formData);
      } else {
        savedResult = await createResult(formData);
      }
      onSubmit(savedResult);
      setFormData(defaultFormObj);
      toast.success("Result saved successfully");
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error("Failed to save result");
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.resultType || !formData.date || !formData.resultValue || !formData.discipline.id) {
      errors.push("Please fill out all fields.");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const disciplineId = parseInt(e.target.value, 10);
    const selectedDiscipline = allDisciplines.find((discipline) => discipline.id === disciplineId);
    if (selectedDiscipline) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        discipline: selectedDiscipline,
      }));
    }
  };

  return (
    <div className="result-form-page">
      <h2 className="result-header">{formData.id ? "Edit Result" : "Add New Result"}</h2>
      <div className="result-form-container">
        <form className="result-form" onSubmit={handleSubmit}>
          <label>
            Result Type:
            <input type="text" name="resultType" value={formData.resultType} onChange={handleInputChange} />
          </label>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </label>
          <label>
            Result Value:
            <input type="text" name="resultValue" value={formData.resultValue} onChange={handleInputChange} />
          </label>
          <label>
            Discipline:
            <select name="discipline" value={formData.discipline.id} onChange={handleDisciplineChange}>
              <option value="">Select Discipline</option>
              {allDisciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-errors">
            {formErrors.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
          <button type="submit">Save Result</button>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;
