import React from "react";
import { genExerciseDict } from "./chartService";

describe("genExerciseDict", () => {
  it("should generate exercise dict of expected format, recording only highest 1RM per day per exercise", () => {
    const exerciseDict = genExerciseDict(
      [
        {
          id: 1,
          name: "Lat Pulldown",
          updated_at: "2019-10-15T00:05:32.000Z",
          created_at: "2019-10-15T00:05:32.000Z"
        }
      ],
      [
        [
          {
            id: 1,
            exercise_id: 1,
            created_at: "2019-10-15T00:05:32.000Z",
            updated_at: "2019-10-15T00:05:32.000Z",
            performed_at: "2019-10-15T00:05:32.000Z",
            reps: 30,
            weight: 30,
            workout_id: 3
          },
          {
            id: 2,
            exercise_id: 1,
            created_at: "2019-10-20T00:05:32.000Z",
            updated_at: "2019-10-20T00:05:32.000Z",
            performed_at: "2019-10-20T00:05:32.000Z",
            reps: 30,
            weight: 50,
            workout_id: 4
          },
          {
            id: 3,
            exercise_id: 1,
            created_at: "2019-10-20T00:05:32.000Z",
            updated_at: "2019-10-20T00:05:32.000Z",
            performed_at: "2019-10-20T00:05:32.000Z",
            reps: 30,
            weight: 80,
            workout_id: 4
          }
        ]
      ]
    );

    expect(exerciseDict).toEqual({
      1: {
        id: 1,
        name: "Lat Pulldown",
        updated_at: "2019-10-15T00:05:32.000Z",
        created_at: "2019-10-15T00:05:32.000Z",
        highest1RM: 411.42857142857144,
        history: [
          { date: "2019-10-15T00:05:32.000Z", value: 154.28571428571428 },
          { date: "2019-10-20T00:05:32.000Z", value: 411.42857142857144 }
        ]
      }
    });
  });

  it("should return empty object if input are empty arrays", () => {
    expect(genExerciseDict([], [])).toEqual({});
  });
});
