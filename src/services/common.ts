import { getCachedBasicAuth } from "./authService";

const baseUrl = "https://my-workout-turtle.herokuapp.com/api/v1";
export const getOptions = (Authorization: string): RequestInit => ({
  method: "GET",
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    Authorization
  }
});

export const API = {
  singleSets: (workOutId: number) =>
    `${baseUrl}/users/1/workouts/${workOutId}/single_sets.json`,
  exercises: () => `${baseUrl}/exercises.json`,
  workouts: () => `${baseUrl}/users/1/workouts.json`
};

// This is an utility function for sending get requests according to
// the predefined options above
export const get = async (
  url: string,
  { username, password }: { username?: string; password?: string } = {}
) => {
  try {
    let basicAuth = "";
    if (!!username && !!password) {
      // It's trying to call with new credentials
      basicAuth = convertToBasicAuth(username, password);
    } else {
      // It's trying to call with existing credentials (if any)
      basicAuth = getCachedBasicAuth();
    }

    const response = await fetch(
      url,
      // Gets params that're needed for the request
      getOptions(basicAuth)
    );
    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const convertToBasicAuth = (username: string, password: string) =>
  `Basic ${btoa(username + ":" + password)}`;
