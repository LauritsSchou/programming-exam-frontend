import { Discipline } from "./disciplineInterface";
export interface Result {
  id?: number;
  resultType: string;
  date: Date;
  resultValue: string;
  discipline: Discipline;
}
