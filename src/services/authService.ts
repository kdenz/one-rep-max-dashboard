import { get, API, convertToBasicAuth } from "./common";

// Singleton cached basic auth that can be used until user closes the window
let cachedBasicAuth = "";

const setCachedBasicAuth = (username: string, password: string) => {
  cachedBasicAuth = convertToBasicAuth(username, password);
};

export const getCachedBasicAuth = () => cachedBasicAuth;

// Since there isn't a login endpoint now
// We'll use randomly hit a relatively light API and see if it works
export const loginUser = async (username: string, password: string) => {
  try {
    await get(API.exercises(), { username, password });
    setCachedBasicAuth(username, password);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
