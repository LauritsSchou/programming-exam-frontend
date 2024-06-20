import React from "react";
import { Result } from "../interfaces/resultInterface";
import { Athlete } from "../interfaces/athleteInterface";
import { deleteResult } from "../apiFacade";
import { toast } from "react-toastify";
import "../styling/result-list.css";

interface ResultListProps {
  results: Result[];
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
  athletes: Athlete[];
  onEdit: (result: Result, athleteId: number | null) => void;
}

const ResultList: React.FC<ResultListProps> = ({ results, setResults, athletes, onEdit }) => {
  const [searchTerm] = React.useState("");
  const [resultTypeFilter, setResultTypeFilter] = React.useState("");
  const [disciplineFilter, setDisciplineFilter] = React.useState("");

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      console.error("Cannot delete result: id is undefined");
      return;
    }

    try {
      // Delete result from backend
      await deleteResult(id);

      // Update frontend state to remove deleted result
      setResults(results.filter((result) => result.id !== id));

      toast.success("Result deleted successfully");
    } catch (error) {
      toast.error("Could not delete result, something went wrong.");
      console.error(error);
    }
  };

  const handleEdit = (result: Result) => {
    const athlete = athletes.find((athlete) => athlete.results.some((athleteResult) => athleteResult.id === result.id));
    const athleteId = athlete ? athlete.id : null;
    onEdit(result, athleteId);
    window.scrollTo(0, 0);
  };

  const getAthleteName = (result: Result) => {
    const athlete = athletes.find((athlete) => athlete.results.some((athleteResult) => athleteResult.id === result.id));
    return athlete ? athlete.name : "Unknown Athlete";
  };

  const filteredResults = results
    .filter((result) => result.resultType.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((result) => (resultTypeFilter ? result.resultType === resultTypeFilter : true))
    .filter((result) => (disciplineFilter ? result.discipline.name.toLowerCase().includes(disciplineFilter.toLowerCase()) : true));

  return (
    <div className="result-list-page">
      <h2 className="result-header">Results</h2>

      <div className="filters">
        <input type="text" placeholder="Filter by discipline" value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)} />
        <select value={resultTypeFilter} onChange={(e) => setResultTypeFilter(e.target.value)}>
          <option value="">All Result Types</option>
          {Array.from(new Set(results.map((result) => result.resultType))).map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <table className="result-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Result Value</th>
            <th>Date</th>
            <th>Athlete</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result) => (
            <tr key={result.id}>
              <td>{result.discipline.name}</td>
              <td>{result.resultValue}</td>
              <td>{result.date}</td>
              <td>{getAthleteName(result)}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(result)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(result.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultList;
