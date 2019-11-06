/**
 * This provides data fetching + transforming mechanism for getting
 * historical 1RM data from the mocked Fitbod server hosted on Heroku
 */
import { calcOneRepMax } from "utils/oneRepMax";

const baseUrl = "https://my-workout-turtle.herokuapp.com/api/v1";
const options: RequestInit = {
  method: "GET",
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    // This is hardcoded for user 1 's login credentials
    Authorization: "Basic dXNlcjFAZml0Ym9kLm1lOndvcmtmaXQ="
  }
};

const API = {
  singleSets: (workOutId: number) =>
    `${baseUrl}/users/1/workouts/${workOutId}/single_sets.json`,
  exercises: () => `${baseUrl}/exercises.json`,
  workouts: () => `${baseUrl}/users/1/workouts.json`
};

// This is an utility function for sending get requests according to
// the predefined options above
export const get = async (url: string) => {
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
};

interface CommonFields {
  id: number;
  created_at: string;
  updated_at: string;
}

interface Exercise extends CommonFields {
  name: string;
}

interface Workout extends CommonFields {
  userId: number;
  workoutDate: string;
  workoutDuration: number;
}

interface SingleSet extends CommonFields {
  weight: number;
  reps: number;
  performed_at: string;
  workout_id: number;
  exercise_id: number;
}

type OneRepMax = {
  date: string;
  value: number;
};

interface ExerciseWith1RMHistory extends Exercise {
  history: OneRepMax[];
  highest1RM: number;
}

export interface ExerciseDict {
  [exerciseId: number]: ExerciseWith1RMHistory;
}

/**
 * This function creates an exercise dictionary object from fetched data
 * with key as the exercise id, say 1, and value as type ExerciseWith1RMHistory
 */
export const genExerciseDict = (
  exercises: Exercise[],
  workoutSession: SingleSet[][]
) => {
  const exerciseDict: ExerciseDict = {};

  // Generate initial exercise map with empty 1RM history
  exercises.forEach(exercise => {
    exerciseDict[exercise.id] = {
      ...exercise,
      history: [],
      highest1RM: 0
    };
  });

  // Generate 1RM history
  // Each workout session contains N sets
  workoutSession.forEach(sessionSets => {
    sessionSets.forEach(set => {
      if (exerciseDict[set.exercise_id]) {
        // If set belongs to an existing exercise, push 1RM data to exercise
        const oneRepMax = calcOneRepMax(set.weight, set.reps);
        exerciseDict[set.exercise_id].history.push({
          date: set.performed_at,
          value: oneRepMax
        });

        // Also finds the highest 1RM per exercise and saves the highest 1RM value
        const highest1RM = exerciseDict[set.exercise_id].highest1RM;
        if (oneRepMax > highest1RM) {
          exerciseDict[set.exercise_id].highest1RM = oneRepMax;
        }
      }
    });
  });

  // Sort the workouts in chronological order
  for (const key in exerciseDict) {
    if (exerciseDict.hasOwnProperty(key)) {
      exerciseDict[key].history.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
  }

  return exerciseDict;
};

// TODO Remove hacky solution once backend chart data endpoint is implemented
// This function fetches required data from BE in order to have the historical 1RM data
export const loadExerciseDict = async (
  refresh?: boolean
): Promise<ExerciseDict> => {
  try {
    // Returns previously cached strings if necessary and exists
    const cachedDataString = localStorage.getItem("exerciseDict");
    if (cachedDataString && !refresh) {
      return JSON.parse(cachedDataString);
    }

    // Fetches exercises and workouts from server
    const [exercises, workouts]: [Exercise[], Workout[]] = await Promise.all([
      get(API.exercises()),
      get(API.workouts())
    ]);

    // Fetches single sets for EACH user workout
    // WARNING if there're 100 user workouts it may lead to 100 requests at once
    const singleSets: SingleSet[][] = await Promise.all(
      workouts.map(item => get(API.singleSets(item.id)))
    );

    // Create chart history data
    const exerciseDict = genExerciseDict(exercises, singleSets);

    // Stores the exercise dictionary to local storage instead of fetching it again
    // every single time browser refreshes (I don't want to spam the server too much)
    localStorage.setItem("exerciseDict", JSON.stringify(exerciseDict));

    return exerciseDict;
  } catch (err) {
    throw new Error(err);
  }
};
