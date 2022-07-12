import { toLetter, toNumber } from "../utils/String";

describe("toLetter", () => {
  const letterConditions = [
    {
      caseName: "input number",
      id: 1,
      result: "A",
    },
    { caseName: "input string(number)", id: "2", result: "B" },
    { caseName: "input string(not number)", id: "s", result: "" },
    { caseName: "input no value", id: "", result: "" },
  ];
  for (const element of letterConditions) {
    it(element.caseName, () => {
      expect(toLetter(element.id)).toBe(element.result);
    });
  }
});

describe("toNumber", () => {
  const numberContitions = [
    { caseName: "input string(A-Z)", str: "A", result: 1 },
    { caseName: "input string(except A-Z)", str: "a", result: 33 },
    { caseName: "input number", str: 1, result: "" },
    { caseName: "input no value", str: "", result: "" },
  ];

  for (const element of numberContitions) {
    it(element.caseName, () => {
      expect(toNumber(element.str)).toBe(element.result);
    });
  }
});
