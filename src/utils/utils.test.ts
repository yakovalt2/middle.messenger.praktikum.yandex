import { expect } from "chai";
import { utils, Indexed } from "./utils.ts";

describe("utils", () => {
  describe("isEqual", () => {
    it("должен вернуть true для одинаковых объектов", () => {
      const a = { x: 1, y: { z: 2 } };
      const b = { x: 1, y: { z: 2 } };
      expect(utils.isEqual(a, b)).to.be.true;
    });

    it("должен вернуть false для разных объектов", () => {
      const a = { x: 1, y: 2 };
      const b = { x: 1, y: 3 };
      expect(utils.isEqual(a, b)).to.be.false;
    });

    it("должен выбросить ошибку, если один из аргументов null", () => {
      expect(() => utils.isEqual(null as any, {})).to.throw();
    });
  });

  describe("queryStringify", () => {
    it("должен корректно сериализовать простой объект", () => {
      const data = { name: "Alice", age: 30 };
      const result = utils.queryStringify(data);
      expect(result).to.satisfy(
        (str: string) =>
          str === "name=Alice&age=30" || str === "age=30&name=Alice"
      );
    });

    it("должен корректно сериализовать массив внутри объекта", () => {
      const data = { tags: ["a", "b"] };
      expect(utils.queryStringify(data)).to.equal("tags[0]=a&tags[1]=b");
    });

    it("должен корректно сериализовать вложенные объекты", () => {
      const data = { user: { name: "Bob", age: 25 } };
      const result = utils.queryStringify(data);
      expect(result).to.satisfy(
        (str: string) =>
          str === "user[name]=Bob&user[age]=25" ||
          str === "user[age]=25&user[name]=Bob"
      );
    });
  });

  describe("set", () => {
    it("должен установить значение по пути", () => {
      const obj: Indexed = {};
      const result = utils.set(obj, "a.b.c", 42);
      expect(result).to.deep.equal({ a: { b: { c: 42 } } });
    });

    it("должен перезаписать существующее значение", () => {
      const obj: Indexed = { a: { b: { c: 1 } } };
      const result = utils.set(obj, "a.b.c", 99);
      expect(result).to.deep.equal({ a: { b: { c: 99 } } });
    });

    it("должен выбросить ошибку при некорректном пути", () => {
      const obj: Indexed = {};
      expect(() => utils.set(obj, 123 as any, "value")).to.throw();
    });
  });
});
