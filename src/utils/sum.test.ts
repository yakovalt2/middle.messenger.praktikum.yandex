import { expect } from "chai";
import { sum } from "./sum.ts";

describe("sum()", () => {
  it("должна корректно складывать два числа", () => {
    expect(sum(2, 3)).to.equal(5);
  });
});