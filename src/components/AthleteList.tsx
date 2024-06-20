import { useState } from "react";
import { deleteAthlete } from "../apiFacade";
import { Athlete } from "../interfaces/athleteInterface";
import { toast } from "react-toastify";
import AthleteDetailsModal from "./AthleteDetailsModal";
import "../styling/athlete-list.css";

interface AthleteListProps {
  athletes: Athlete[];
  setAthletes: React.Dispatch<React.SetStateAction<Athlete[]>>;
  onEdit: (athlete: Athlete) => void;
}

const AthleteList: React.FC<AthleteListProps> = ({ athletes, setAthletes, onEdit }) => {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      console.error("Cannot delete athlete: id is undefined");
      return;
    }

    try {
      await deleteAthlete(id);
      setAthletes(athletes.filter((athlete) => athlete.id !== id));
      toast.success("Athlete deleted successfully");
    } catch (error) {
      toast.error("Could not delete athlete, something went wrong.");
      console.error(error);
    }
  };

  const handleEdit = async (athlete: Athlete) => {
    onEdit(athlete);
    window.scrollTo(0, 0);
  };

  const showDetails = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAthlete(null);
  };

  const getAgeGroup = (age: number): string => {
    if (age >= 6 && age <= 9) return "children";
    if (age >= 10 && age <= 13) return "young";
    if (age >= 14 && age <= 22) return "junior";
    if (age >= 23 && age <= 40) return "adult";
    if (age >= 41) return "senior";
    return "";
  };

  const sortAthletes = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedAthletes = [...athletes];

  if (sortBy) {
    sortedAthletes.sort((a, b) => {
      const fieldA = a[sortBy as keyof Athlete];
      const fieldB = b[sortBy as keyof Athlete];

      if (sortBy === "age") {
        return sortOrder === "asc" ? (fieldA as number) - (fieldB as number) : (fieldB as number) - (fieldA as number);
      } else if (sortBy === "disciplines") {
        const disciplinesA = a.disciplines.map((d) => d.name).join(", ");
        const disciplinesB = b.disciplines.map((d) => d.name).join(", ");
        return sortOrder === "asc" ? disciplinesA.localeCompare(disciplinesB) : disciplinesB.localeCompare(disciplinesA);
      } else {
        return sortOrder === "asc" ? (fieldA as string).localeCompare(fieldB as string) : (fieldB as string).localeCompare(fieldA as string);
      }
    });
  }

  const filteredAthletes = sortedAthletes
    .filter((athlete) => athlete.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((athlete) => (genderFilter ? athlete.gender === genderFilter : true))
    .filter((athlete) => (clubFilter ? athlete.club.toLowerCase().includes(clubFilter.toLowerCase()) : true))
    .filter((athlete) => (disciplineFilter ? athlete.disciplines.some((discipline) => discipline.name.toLowerCase().includes(disciplineFilter.toLowerCase())) : true))
    .filter((athlete) => (ageGroupFilter ? getAgeGroup(athlete.age) === ageGroupFilter : true));

  return (
    <div className="athlete-list-page">
      <h2 className="athlete-header">Athletes</h2>

      <div className="filters">
        <input type="text" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <input type="text" placeholder="Filter by club" value={clubFilter} onChange={(e) => setClubFilter(e.target.value)} />
        <input type="text" placeholder="Filter by discipline" value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)} />
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select value={ageGroupFilter} onChange={(e) => setAgeGroupFilter(e.target.value)}>
          <option value="">All Age Groups</option>
          <option value="children">Children (6-9 years)</option>
          <option value="young">Young (10-13 years)</option>
          <option value="junior">Junior (14-22 years)</option>
          <option value="adult">Adult (23-40 years)</option>
          <option value="senior">Senior (41+ years)</option>
        </select>
      </div>

      <table className="athlete-table">
        <thead>
          <tr>
            <th onClick={() => sortAthletes("name")}>Name</th>
            <th onClick={() => sortAthletes("age")}>Age</th>
            <th onClick={() => sortAthletes("gender")}>Gender</th>
            <th onClick={() => sortAthletes("club")}>Club</th>
            <th onClick={() => sortAthletes("disciplines")}>Disciplines</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAthletes.map((athlete) => (
            <tr key={athlete.id}>
              <td>{athlete.name}</td>
              <td>{athlete.age}</td>
              <td>{athlete.gender}</td>
              <td>{athlete.club}</td>
              <td>{athlete.disciplines.map((discipline) => discipline.name).join(", ")}</td>
              <td>
                <button className="details-button" onClick={() => showDetails(athlete)}>
                  Details
                </button>
                <button className="edit-button" onClick={() => handleEdit(athlete)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(athlete.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AthleteDetailsModal isOpen={isModalOpen} onRequestClose={closeModal} athlete={selectedAthlete} />
    </div>
  );
};

export default AthleteList;
