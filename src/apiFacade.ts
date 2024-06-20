import { Athlete } from "./interfaces/athleteInterface";
import { API_URL } from "./settings";

function makeOptions(method: string, body: object | null): RequestInit {
  const opts: RequestInit = {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };
  if (body) {
    opts.body = JSON.stringify(body);
  }
  return opts;
}

async function handleHttpErrors(res: Response) {
  if (!res.ok) {
    const fullError = await res.json();
    throw { status: res.status, fullError };
  }
  if (res.status === 204) {
    return {};
  }

  return res.json();
}

async function getAthletes(): Promise<Athlete[]> {
  return fetch(API_URL + "/athletes").then(handleHttpErrors);
}
async function getAthleteById(id: number): Promise<Athlete> {
  return fetch(API_URL + "/athletes/" + id).then(handleHttpErrors);
}
async function createAthlete(athlete: Athlete): Promise<Athlete> {
  return fetch(API_URL + "/athletes", makeOptions("POST", athlete)).then(handleHttpErrors);
}
async function updateAthlete(id: number, athlete: Athlete): Promise<Athlete> {
  const options = makeOptions("PUT", athlete);
  return fetch(API_URL + "/athletes/" + id, options).then(handleHttpErrors);
}
async function deleteAthlete(id: number) {
  const options = makeOptions("DELETE", null);
  const response = await fetch(API_URL + "/athletes/" + id, options);
  return response.status;
}
async function getDisciplines() {
  return fetch(API_URL + "/disciplines").then(handleHttpErrors);
}
async function getResults() {
  return fetch(API_URL + "/results").then(handleHttpErrors);
}
async function getResultsById(id: number) {
  return fetch(API_URL + "/results/" + id).then(handleHttpErrors);
}
async function createResult(result: object) {
  return fetch(API_URL + "/results", makeOptions("POST", result)).then(handleHttpErrors);
}
async function updateResult(id: number, result: object) {
  return fetch(API_URL + "/results/" + id, makeOptions("PUT", result)).then(handleHttpErrors);
}
async function deleteResult(id: number) {
  const options = makeOptions("DELETE", null);
  const response = await fetch(API_URL + "/results/" + id, options);
  return response.status;
}

export { getAthletes, getAthleteById, createAthlete, updateAthlete, deleteAthlete, getDisciplines, getResults, getResultsById, createResult, updateResult, deleteResult };
