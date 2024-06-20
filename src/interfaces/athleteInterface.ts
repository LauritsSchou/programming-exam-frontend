import { Discipline } from "./disciplineInterface";
import { Result } from "./resultInterface";
export interface Athlete {
  id?: number;
  name: string;
  age: number;
  gender: string;
  club: string;
  disciplines: Discipline[];
  results: Result[];
}
