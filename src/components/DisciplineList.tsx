import React from "react";
import { Discipline } from "../interfaces/disciplineInterface";
import "../styling/discipline-list.css";

interface DisciplineListProps {
  disciplines: Discipline[];
  onEdit: (discipline: Discipline) => void;
}

const DisciplineList: React.FC<DisciplineListProps> = ({ disciplines, onEdit }) => {
  return (
    <div className="discipline-list-page">
      <h2 className="discipline-header">Disciplines</h2>

      <table className="discipline-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Result Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disciplines.map((discipline) => (
            <tr key={discipline.id}>
              <td>{discipline.name}</td>
              <td>{discipline.resultType}</td>
              <td>
                <button className="edit-button" onClick={() => onEdit(discipline)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisciplineList;
