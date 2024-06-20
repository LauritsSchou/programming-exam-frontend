// components/AthleteDetailsModal.tsx
import Modal from "react-modal";
import { Athlete } from "../interfaces/athleteInterface";
import "../styling/athlete-details-modal.css";

interface AthleteDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  athlete: Athlete | null;
}

const AthleteDetailsModal: React.FC<AthleteDetailsModalProps> = ({ isOpen, onRequestClose, athlete }) => {
  if (!athlete) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Athlete Details" className="athlete-modal">
      <h2>{athlete.name}</h2>
      <p>
        <strong>Age:</strong> {athlete.age}
      </p>
      <p>
        <strong>Gender:</strong> {athlete.gender}
      </p>
      <p>
        <strong>Club:</strong> {athlete.club}
      </p>
      <p>
        <strong>Disciplines:</strong> {athlete.disciplines.map((discipline) => discipline.name).join(", ")}
      </p>
      <p>
        <strong>Results:</strong>
      </p>
      <ul>
        {athlete.results.map((result, index) => (
          <li key={index}>
            {result.resultValue} ({result.discipline.name})
          </li>
        ))}
      </ul>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default AthleteDetailsModal;
