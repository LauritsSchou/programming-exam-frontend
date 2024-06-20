import { useState, useEffect } from "react";
import AthleteList from "../components/AthleteList";
import AthleteForm from "../components/AthleteForm";
import { Athlete } from "../interfaces/athleteInterface";
import { getAthletes } from "../apiFacade";

function AthletePage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  const fetchAthletes = async () => {
    const athletesList = await getAthletes();
    setAthletes(athletesList);
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const handleAthleteSubmit = () => {
    setSelectedAthlete(null);
    fetchAthletes();
  };

  const handleAthleteEdit = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
  };

  return (
    <div style={{ display: "flex", margin: "2rem", padding: "1vw", gap: "20vw", justifyContent: "space-evenly" }}>
      <AthleteForm onSubmit={handleAthleteSubmit} athlete={selectedAthlete} />
      <AthleteList athletes={athletes} setAthletes={setAthletes} onEdit={handleAthleteEdit} />
    </div>
  );
}

export default AthletePage;
