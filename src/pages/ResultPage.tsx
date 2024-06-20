import { useState, useEffect } from "react";
import ResultList from "../components/ResultList";
import ResultForm from "../components/ResultForm";
import { Athlete } from "../interfaces/athleteInterface";
import { Result } from "../interfaces/resultInterface";
import { getAthletes, getResults, updateAthlete, getAthleteById } from "../apiFacade";

function ResultPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchAthletes();
    fetchResults();
  }, []);

  const fetchAthletes = async () => {
    try {
      const athletesList = await getAthletes();
      setAthletes(athletesList);
    } catch (error) {
      console.error("Error fetching athletes:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const resultsList = await getResults();
      setResults(resultsList);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleResultSubmit = async (result: Result, athleteId: number) => {
    try {
      const athlete = await getAthleteById(athleteId);
      athlete.results.push(result);

      // Update the athlete with the new result
      await updateAthlete(athleteId, athlete);

      // Refresh athletes and results after update
      await fetchAthletes();
      await fetchResults();

      setSelectedResult(null);
      setSelectedAthleteId(null);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error assigning result to athlete:", error);
    }
  };

  const handleResultEdit = async (result: Result, athleteId: number | null) => {
    setSelectedResult(result);
    setSelectedAthleteId(athleteId);
  };

  return (
    <div style={{ display: "flex", margin: "2rem", padding: "1vw", gap: "20vw", justifyContent: "space-evenly" }}>
      <ResultForm onSubmit={handleResultSubmit} result={selectedResult} selectedAthleteId={selectedAthleteId} />
      <ResultList results={results} setResults={setResults} athletes={athletes} onEdit={handleResultEdit} />
    </div>
  );
}

export default ResultPage;
