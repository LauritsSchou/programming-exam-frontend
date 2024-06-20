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
  const [disciplineFilter, setDisciplineFilter] = React.useState<string>("");
  const [genderFilter, setGenderFilter] = React.useState<string>("");
  const [ageGroupFilter, setAgeGroupFilter] = React.useState<string>("");

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
    if (athleteId !== undefined) {
      onEdit(result, athleteId);
      window.scrollTo(0, 0);
    }
  };

  const getAthleteName = (result: Result) => {
    const athlete = athletes.find((athlete) => athlete.results.some((athleteResult) => athleteResult.id === result.id));
    return athlete ? athlete.name : "Unknown Athlete";
  };

  const athleteGender = (result: Result): string => {
    const athlete = athletes.find((athlete) => athlete.results.some((athleteResult) => athleteResult.id === result.id));
    return athlete ? athlete.gender : "";
  };

  const inAgeGroup = (result: Result, group: string): boolean => {
    const athlete = athletes.find((athlete) => athlete.results.some((athleteResult) => athleteResult.id === result.id));

    if (!athlete) return false;

    const age = athlete.age;
    switch (group) {
      case "child":
        return age >= 6 && age <= 9;
      case "young":
        return age >= 10 && age <= 13;
      case "junior":
        return age >= 14 && age <= 22;
      case "adult":
        return age >= 23 && age <= 40;
      case "senior":
        return age >= 41;
      default:
        return false;
    }
  };

  const filteredResults = results.filter((result) => {
    let match = true;

    if (disciplineFilter && result.discipline.name.toLowerCase() !== disciplineFilter.toLowerCase()) {
      match = false;
    }

    if (genderFilter && athleteGender(result) !== genderFilter) {
      match = false;
    }

    if (ageGroupFilter && !inAgeGroup(result, ageGroupFilter)) {
      match = false;
    }

    return match;
  });

  const sortResults = (filteredResults: Result[]): Result[] => {
    return filteredResults.sort((a, b) => {
      switch (a.resultType) {
        case "TIME":
          // For time, lower is better, so a - b
          return parseTime(a.resultValue) - parseTime(b.resultValue);
        case "DISTANCE":
        case "POINTS":
          return parseInt(b.resultValue) - parseInt(a.resultValue);
        default:
          return 0;
      }
    });
  };

  const parseTime = (time: string): number => {
    const parts = time.split(":");
    if (parts.length === 4) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]) + parseInt(parts[3]) / 1000;
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else {
      return parseInt(parts[0]);
    }
  };

  const handleDisciplineFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisciplineFilter(e.target.value);
  };

  const handleGenderFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenderFilter(e.target.value);
  };

  const handleAgeGroupFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgeGroupFilter(e.target.value);
  };

  return (
    <div className="result-list-page">
      <h2 className="result-header">Results</h2>

      <div className="filters">
        <label>
          Discipline:
          <select value={disciplineFilter} onChange={handleDisciplineFilterChange}>
            <option value="">All Disciplines</option>
            {Array.from(new Set(results.map((result) => result.discipline.name))).map((discipline, index) => (
              <option key={index} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </label>
        <label>
          Gender:
          <select value={genderFilter} onChange={handleGenderFilterChange}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Age Group:
          <select value={ageGroupFilter} onChange={handleAgeGroupFilterChange}>
            <option value="">All Age Groups</option>
            <option value="child">Child (6-9)</option>
            <option value="young">Young (10-13)</option>
            <option value="junior">Junior (14-22)</option>
            <option value="adult">Adult (23-40)</option>
            <option value="senior">Senior (41+)</option>
          </select>
        </label>
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
          {sortResults(filteredResults).map((result) => (
            <tr key={result.id}>
              <td>{result.discipline.name}</td>
              <td>
                {result.resultValue} {result.resultType === "DISTANCE" ? "m" : result.resultType === "POINTS" ? "points" : ""}
              </td>
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
