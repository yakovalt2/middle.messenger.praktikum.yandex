import Block from "./Block";
import Navigation from "../components/Navigation";

type BlockClass<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> = {
  new (props: TProps): Block<TProps>;
};

type RenderFunction = (rootQuery: string, block: Block) => void;

declare const render: RenderFunction;

class Route<TProps extends Record<string, unknown> = Record<string, unknown>> {
  private _pathname: string;
  private _blockClass: BlockClass<TProps>;
  private _block: Block<TProps> | null = null;
  private _props: { rootQuery: string };
  private _showPageCallback: (page: Block) => void;

  constructor(
    pathname: string,
    view: BlockClass<TProps>,
    props: { rootQuery: string },
    showPageCallback: (page: Block) => void
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
    this._showPageCallback = showPageCallback;
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass({} as TProps);
    }
    this._showPageCallback(
      this._block as unknown as Block<Record<string, unknown>>
    );
    this._block.show();
  }
}

export default class Router<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> {
  private static __instance: Router<Record<string, unknown>> | null = null;
  private routes: Route<TProps>[] = [];
  private history: History = window.history;
  private _currentRoute: Route<TProps> | null = null;
  private _rootQuery: string = "";
  private navigation: Navigation = new Navigation(); // Панель навигации

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance as Router<TProps>;
    }
    this._rootQuery = rootQuery;
    this.navigation = new Navigation();
    Router.__instance = this as Router<Record<string, unknown>>;
  }

  private showPage(page: Block): void {
    const root = document.querySelector(this._rootQuery);
    if (!root) {
      console.error(`Root element not found for selector: ${this._rootQuery}`);
      return;
    }
    root.innerHTML = "";

    const navigationContent = this.navigation.getContent();
    if (navigationContent) {
      root.appendChild(navigationContent);
    }

    const pageContent = page.getContent();
    if (pageContent) {
      root.appendChild(pageContent);
    } else {
      console.error("Page content is null");
    }
  }

  use(pathname: string, block: BlockClass<TProps>): this {
    const route = new Route(
      pathname,
      block,
      { rootQuery: this._rootQuery },
      this.showPage.bind(this)
    );
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = ((event: PopStateEvent) => {
      this._onRoute(window.location.pathname);
    }).bind(this);
    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    if (!route) {
      console.error(`Route not found for pathname: ${pathname}`);
      return;
    }
    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }
    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  private getRoute(pathname: string): Route<TProps> | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
