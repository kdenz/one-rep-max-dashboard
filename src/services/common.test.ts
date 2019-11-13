import { getOptions, API, convertToBasicAuth } from "./common";

it("should return correct fetch options", () => {
  const result = getOptions("Basic 12345");
  expect(result).toEqual({
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Basic 12345"
    }
  });
});

it("should return correct API urls", () => {
  expect(API.singleSets(1, 1)).toEqual(
    "https://my-workout-turtle.herokuapp.com/api/v1/users/1/workouts/1/single_sets.json"
  );

  expect(API.exercises()).toEqual(
    "https://my-workout-turtle.herokuapp.com/api/v1/exercises.json"
  );

  expect(API.workouts(1)).toEqual(
    "https://my-workout-turtle.herokuapp.com/api/v1/users/1/workouts.json"
  );

  expect(API.users()).toEqual(
    "https://my-workout-turtle.herokuapp.com/api/v1/users.json"
  );
});

it("converts email and password into legit basic auth format", () => {
  expect(convertToBasicAuth("hello@gmail.com", "12345")).toEqual(
    "Basic aGVsbG9AZ21haWwuY29tOjEyMzQ1"
  );
});
