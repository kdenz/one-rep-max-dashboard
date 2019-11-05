import { calcOneRepMax } from "utils/oneRepMax";

let baseUrl = "https://my-workout-turtle.herokuapp.com/api/v1";
let options: RequestInit = {
  method: "GET",
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: "Basic dXNlcjFAZml0Ym9kLm1lOndvcmtmaXQ="
  }
};

const API = {
  singleSets: (workOutId: number) =>
    `${baseUrl}/users/1/workouts/${workOutId}/single_sets.json`,
  exercises: () => `${baseUrl}/exercises.json`,
  workouts: () => `${baseUrl}/users/1/workouts.json`
};

export const get = async (url: string) => {
  try {
    const response = await fetch(url, options);
    // let responseOK = response?.ok
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

const genExerciseDict = (
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

    localStorage.setItem("exerciseDict", JSON.stringify(exerciseDict));

    return exerciseDict;
  } catch (err) {
    throw new Error(err);
  }
};
