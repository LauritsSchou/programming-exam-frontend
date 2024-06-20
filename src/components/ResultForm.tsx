import { useState, useEffect } from "react";
import { getDisciplines, createResult, updateResult, getAthletes } from "../apiFacade";
import { Result } from "../interfaces/resultInterface";
import { Athlete } from "../interfaces/athleteInterface";
import { Discipline } from "../interfaces/disciplineInterface";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/result-form.css";

interface ResultFormProps {
  onSubmit: (result: Result, athleteId: number) => void;
  result: Result | null;
  selectedAthleteId: number | null | undefined;
}

const ResultForm: React.FC<ResultFormProps> = ({ onSubmit, result, selectedAthleteId }) => {
  const defaultFormObj: Result = {
    id: undefined,
    resultType: "",
    date: "",
    resultValue: "",
    discipline: { id: 0, name: "", resultType: "" },
  };

  const [formData, setFormData] = useState<Result>(result || defaultFormObj);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>([]);
  const [allAthletes, setAllAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<number | null | undefined>(selectedAthleteId);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(result || defaultFormObj);
    setSelectedAthlete(selectedAthleteId);
    fetchDisciplines();
    fetchAthletes();
  }, [result, selectedAthleteId]);

  const fetchDisciplines = async () => {
    try {
      const disciplines = await getDisciplines();
      setAllDisciplines(disciplines);
    } catch (error) {
      console.error("Error fetching disciplines:", error);
      toast.error("Failed to fetch disciplines");
    }
  };

  const fetchAthletes = async () => {
    try {
      const athletes = await getAthletes();
      setAllAthletes(athletes);
    } catch (error) {
      console.error("Error fetching athletes:", error);
      toast.error("Failed to fetch athletes");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (selectedAthlete !== null && selectedAthlete !== undefined) {
        onSubmit(savedResult, selectedAthlete);
      }
      setFormData(defaultFormObj);
      setSelectedAthlete(null);
      toast.success("Result saved successfully");
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error("Failed to save result");
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.date || !formData.resultValue || !formData.discipline.id || selectedAthlete === null) {
      errors.push("Please fill out all fields and select an athlete.");
    }

    if (formData.discipline.resultType === "TIME") {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9]):([0-9]{1,2})$/;
      if (!timeRegex.test(formData.resultValue)) {
        errors.push("Result value must be in hh:mm:ss:msms format for disciplines with result type time.");
      }
    }

    if (parseFloat(formData.resultValue) < 0) {
      errors.push("Result value cannot be negative.");
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
        resultType: selectedDiscipline.resultType,
      }));
    }
  };

  const handleAthleteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const athleteId = parseInt(e.target.value);
    setSelectedAthlete(athleteId);
    const selectedAthlete = allAthletes.find((athlete) => athlete.id === athleteId);
    if (selectedAthlete) {
      const athleteDisciplineIds = selectedAthlete.disciplines.map((discipline) => discipline.id);
      const disciplines = allDisciplines.filter((discipline) => athleteDisciplineIds.includes(discipline.id));
      setFilteredDisciplines(disciplines);
    }
  };

  return (
    <div className="result-form-page">
      <h2 className="result-header">{formData.id ? "Edit Result" : "Add New Result"}</h2>
      <div className="result-form-container">
        <form className="result-form" onSubmit={handleSubmit}>
          <label>
            Athlete:
            <select value={selectedAthlete || ""} onChange={handleAthleteChange}>
              <option value="">Select Athlete</option>
              {allAthletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Discipline:
            <select name="discipline" value={formData.discipline.id} onChange={handleDisciplineChange}>
              <option value="">Select Discipline</option>
              {filteredDisciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </label>
          <label>
            Result Value:
            <input type="text" name="resultValue" value={formData.resultValue} onChange={handleInputChange} />
          </label>

          {formErrors.length > 0 && (
            <div className="form-errors">
              {formErrors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <button type="submit">{formData.id ? "Update Result" : "Add Result"}</button>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;
