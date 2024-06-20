import { useState, useEffect } from "react";
import ResultList from "../components/ResultList";
import ResultForm from "../components/ResultForm";
import { Result } from "../interfaces/resultInterface";
import { getResults } from "../apiFacade";

function ResultPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const fetchResults = async () => {
    try {
      const resultsList = await getResults();
      setResults(resultsList);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleResultSubmit = () => {
    setSelectedResult(null);
    fetchResults();
  };

  const handleResultEdit = (result: Result) => {
    setSelectedResult(result);
  };

  return (
    <div style={{ display: "flex", margin: "2rem", padding: "1vw", gap: "20vw", justifyContent: "space-evenly" }}>
      <ResultForm onSubmit={handleResultSubmit} result={selectedResult} />
      <ResultList results={results} setResults={setResults} onEdit={handleResultEdit} />
    </div>
  );
}

export default ResultPage;
