import { useState, useEffect } from "react";
import DisciplineList from "../components/DisciplineList";
import DisciplineForm from "../components/DisciplineForm";
import { Discipline } from "../interfaces/disciplineInterface";
import { getDisciplines } from "../apiFacade";

function DisciplinePage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  const fetchDisciplines = async () => {
    const disciplinesList = await getDisciplines();
    setDisciplines(disciplinesList);
  };

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const handleDisciplineSubmit = () => {
    setSelectedDiscipline(null);
    fetchDisciplines();
    window.scrollTo(0, 0);
  };

  const handleDisciplineEdit = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ display: "flex", margin: "2rem", padding: "1vw", gap: "20vw", justifyContent: "space-evenly" }}>
      <DisciplineForm onSubmit={handleDisciplineSubmit} discipline={selectedDiscipline} />
      <DisciplineList disciplines={disciplines} onEdit={handleDisciplineEdit} />
    </div>
  );
}

export default DisciplinePage;
