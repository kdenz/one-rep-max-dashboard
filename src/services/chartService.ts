/**
 * This provides data fetching + transforming mechanism for getting
 * historical 1RM data from the mocked Fitbod server hosted on Heroku
 */
import { calcOneRepMax } from "utils/oneRepMax";
import { formatDate } from "utils/date";
import { get, API } from "./common";

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

  const max1RMDict: { [exerciseId: number]: { [day: string]: OneRepMax } } = {};

  // Generate initial exercise map with empty 1RM history
  exercises.forEach(exercise => {
    exerciseDict[exercise.id] = {
      ...exercise,
      history: [],
      highest1RM: 0
    };
    max1RMDict[exercise.id] = {};
  });

  // Generate 1RM history
  // Each workout session contains N sets of different exercises
  workoutSession.forEach(sessionSets => {
    sessionSets.forEach(set => {
      if (exerciseDict[set.exercise_id]) {
        // Set belongs to an existing exercise

        // Check if the 1RM is larger than the previous max 1RM within the same day
        // If yes, replace the current Max 1RM with the new 1RM
        // If no, do nothing (We only want the max 1RM per exercise per day)
        const current1RM = calcOneRepMax(set.weight, set.reps);
        const day = formatDate(set.performed_at, true);
        const prevMax1RM = max1RMDict[set.exercise_id][day]
          ? max1RMDict[set.exercise_id][day].value
          : null;

        if (
          // No prev 1RM + current 1RM is valid
          (!prevMax1RM && current1RM) ||
          // Has prev 1RM but current 1RM is larger than it
          (prevMax1RM && current1RM && current1RM > prevMax1RM)
        ) {
          // Make the current 1RM the max one for the date
          max1RMDict[set.exercise_id][day] = {
            date: set.performed_at,
            value: current1RM
          };

          // Also finds the all-time highest 1RM per exercise and saves it
          const highest1RM = exerciseDict[set.exercise_id].highest1RM;
          if (current1RM && current1RM > highest1RM) {
            exerciseDict[set.exercise_id].highest1RM = current1RM;
          }
        }
      }
    });
  });

  // Converts max1RMDict to an unsorted array of max 1RM records
  for (const i in max1RMDict) {
    if (max1RMDict.hasOwnProperty(i)) {
      // i is exerciseId here
      const max1RMsByDate = max1RMDict[i];

      for (const j in max1RMsByDate) {
        if (max1RMsByDate.hasOwnProperty(j)) {
          // j is day here
          exerciseDict[i].history.push(max1RMsByDate[j]);
        }
      }
    }
  }

  // Sort the workouts in chronological order
  for (const key in exerciseDict) {
    if (exerciseDict.hasOwnProperty(key)) {
      // key is exerciseId here
      exerciseDict[parseInt(key)].history.sort(
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

    return exerciseDict;
  } catch (err) {
    throw new Error(err);
  }
};
