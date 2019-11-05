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
}

type ExerciseDict = {
  [exerciseId: number]: ExerciseWith1RMHistory;
};

const genChartData = (exercises: Exercise[], workoutSession: SingleSet[][]) => {
  const exerciseMap: ExerciseDict = {};

  // Generate initial exercise map with empty 1RM history
  exercises.forEach(exercise => {
    exerciseMap[exercise.id] = {
      ...exercise,
      history: []
    };
  });

  // Generate 1RM history from singleSets
  workoutSession.forEach(sessionSets => {
    sessionSets.forEach(set => {
      if (exerciseMap[set.exercise_id]) {
        // If set belongs to an existing exercise, push 1RM data to exercise
        exerciseMap[set.exercise_id].history.push({
          date: set.performed_at,
          value: calcOneRepMax(set.weight, set.reps)
        });
      }
    });
  });

  return exerciseMap;
};

// TODO Remove hacky solution once backend chart data endpoint is implemented
export const loadChartData = async (refresh?: boolean) => {
  try {
    // Returns previously cached strings if necessary and exists
    const cachedDataString = localStorage.getItem("chartData");
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

    // Create histori
    const chartData = genChartData(exercises, singleSets);

    localStorage.setItem("exercises", JSON.stringify(exercises));
    localStorage.setItem("chartData", JSON.stringify(chartData));

    return chartData;
  } catch (err) {
    throw new Error(err);
  }
};
