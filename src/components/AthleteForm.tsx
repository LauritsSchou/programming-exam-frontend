// AthleteForm.tsx
import { useState, useEffect } from "react";
import { createAthlete, updateAthlete } from "../apiFacade";
import { Athlete } from "../interfaces/athleteInterface";
import { toast } from "react-toastify";
import "../styling/athlete-form.css";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    setFormData(athlete || defaultFormObj);
  }, [athlete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error saving athlete:", error);
      toast.error("Failed to save athlete");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "age" && Number(value) < 0) {
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="athlete-form-page">
      <h2 className="athlete-header">Add New Athlete</h2>
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
          <button type="submit">Save Athlete</button>
        </form>
      </div>
    </div>
  );
};

export default AthleteForm;
