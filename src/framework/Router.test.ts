import { expect } from "chai";
import Router from "../framework/Router.ts";
import Block from "../framework/Block.ts";
import jsdomGlobal from 'jsdom-global';

jsdomGlobal('', { url: 'http://localhost' });

class DummyPage extends Block {
  constructor(props = {}) {
    super("div", props);
  }
  render() {
    return "<div>Dummy</div>";
  }
}

class NotFoundPage extends Block {
  constructor(props = {}) {
    super("div", props);
  }
  render() {
    return "<div>Not Found</div>";
  }
}

describe("Router", () => {
  let router: Router;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);

    router = new Router("#app");
    (router as any).__TEST_MOCK_AUTH__ = true;
    router.use("/dummy", DummyPage);
    router.use("/not-found", NotFoundPage);
  });

  afterEach(() => {
    container.remove();
  });

  it("должен отрендерить DummyPage при переходе", async () => {
    await router.go("/dummy");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(container.innerHTML).to.contain("Dummy");
  });

  it("должен редиректить на /not-found, если маршрут не найден", async () => {
    await router.go("/unknown-path");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(container.innerHTML).to.contain("Not Found");
  });
});
