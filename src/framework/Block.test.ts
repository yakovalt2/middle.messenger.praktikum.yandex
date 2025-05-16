import { expect } from 'chai';
import Block from './Block.ts';

class TestComponent extends Block<{ text: string }> {
  render(): string {
    return `<div>${this.props.text}</div>`;
  }
}

describe("Block", () => {
  it("должен создать HTML элемент", () => {
    const block = new TestComponent("div", { text: "Hello" });
    const content = block.getContent();
    expect(content).to.be.instanceOf(window.HTMLElement);
    expect(content?.outerHTML).to.include("Hello");
  });

  it("должен обновляться при setProps", () => {
    const block = new TestComponent("div", { text: "Initial" });
    const content = block.getContent();
    expect(content?.innerHTML).to.include("Initial");

    block.setProps({ text: "Updated" });
    expect(block.getContent()?.innerHTML).to.include("Updated");
  });

  it("метод show должен делать элемент видимым", () => {
    const block = new TestComponent("div", { text: "Visible" });
    block.hide();
    block.show();
    expect(block.getContent()?.style.display).to.equal("block");
  });

  it("метод hide должен скрывать элемент", () => {
    const block = new TestComponent("div", { text: "Hidden" });
    block.hide();
    expect(block.getContent()?.style.display).to.equal("none");
  });
});
