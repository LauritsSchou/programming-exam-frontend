import React, { useState } from "react";
import { Result } from "../interfaces/resultInterface";
import { deleteResult } from "../apiFacade";
import { toast } from "react-toastify";
import "../styling/result-list.css";

interface ResultListProps {
  results: Result[];
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
  onEdit: (result: Result) => void;
}

const ResultList: React.FC<ResultListProps> = ({ results, setResults, onEdit }) => {
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultTypeFilter, setResultTypeFilter] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      console.error("Cannot delete result: id is undefined");
      return;
    }

    try {
      await deleteResult(id);
      setResults(results.filter((result) => result.id !== id));
      toast.success("Result deleted successfully");
    } catch (error) {
      toast.error("Could not delete result, something went wrong.");
      console.error(error);
    }
  };
  const handleEdit = async (result: Result) => {
    onEdit(result);
    window.scrollTo(0, 0);
  };

  const filteredResults = results
    .filter((result) => result.resultType.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((result) => (resultTypeFilter ? result.resultType === resultTypeFilter : true))
    .filter((result) => (disciplineFilter ? result.discipline.name.toLowerCase().includes(disciplineFilter.toLowerCase()) : true));

  return (
    <div className="result-list-page">
      <h2 className="result-header">Results</h2>

      <div className="filters">
        <input type="text" placeholder="Search by result type" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <th>Result Type</th>
            <th>Date</th>
            <th>Result Value</th>
            <th>Discipline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result) => (
            <tr key={result.id}>
              <td>{result.resultType}</td>
              <td>{result.date}</td>
              <td>{result.resultValue}</td>
              <td>{result.discipline.name}</td>
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
