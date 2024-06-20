import { Discipline } from './disciplineInterface';
export interface Result {
    id?: number;
    resultType: string;
    date: string;
    resultValue: string;
    discipline: Discipline;
}