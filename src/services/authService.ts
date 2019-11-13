import { get, API, convertToBasicAuth } from "./common";

// Singleton cached user info that can be used until user closes the window

let cachedBasicAuth = "";
const setCachedBasicAuth = (username: string, password: string) => {
  cachedBasicAuth = convertToBasicAuth(username, password);
};
export const getCachedBasicAuth = () => cachedBasicAuth;

let cachedUserId: number | undefined;
const setCachedUserId = (newUserId: number) => {
  cachedUserId = newUserId;
};
export const getCachedUserId = () => cachedUserId;

interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}
// TODO Remove hack here as a login endpoint doesn't exist now
// There's only a /users endpoint which returns a list of users
// And that we NEED the user id in order to correctly fetch user-specific info
// So after fetching the list of users we identify which user id belongs to the
// logged in user, and store it in a cached singleton var for use in other functions
export const loginUser = async (username: string, password: string) => {
  try {
    const users: User[] = await get(API.users(), { username, password });

    const currentUser = users.find((user: User) => user.email === username);

    if (currentUser) {
      // It's a valid user with existing records
      setCachedUserId(currentUser.id);
      setCachedBasicAuth(username, password);
    } else {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
