import Block from "./Block";
import Navigation from "../components/Navigation";
import AuthService from "../api/services/AuthService";
import createLoader from "../components/Loader/Loader";
import store from "../framework/Store";

const authService = new AuthService();

type BlockClass<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> = {
  new (props: TProps): Block<TProps>;
};

class Route<TProps extends Record<string, unknown> = Record<string, unknown>> {
  private _pathname: string;
  private _blockClass: BlockClass<TProps>;
  private _block: Block<TProps> | null = null;
  private _showPageCallback: (page: Block) => void;

  constructor(
    pathname: string,
    view: BlockClass<TProps>,
    showPageCallback: (page: Block) => void
  ) {
    this._pathname = pathname;
    this._blockClass = view;
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
  private navigation: Navigation = new Navigation();

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance as Router<TProps>;
    }

    this._rootQuery = rootQuery;
    this.navigation = new Navigation();
    Router.__instance = this as Router<Record<string, unknown>>;

    this.handleLinkClicks();
  }

  private showPage(page: Block): void {
    const root = document.querySelector(this._rootQuery) as HTMLElement;
    if (!root) {
      console.error(`Root element not found for selector: ${this._rootQuery}`);
      return;
    }

    root.innerHTML = "";
    root.appendChild(createLoader());

    setTimeout(() => {
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

      root.style.opacity = "1";
    }, 300); 
  }

  use(pathname: string, block: BlockClass<TProps>): this {
    const route = new Route(pathname, block, this.showPage.bind(this));
    this.routes.push(route);
    return this;
  }

  async start(): Promise<void> {
    window.onpopstate = (() => {
      this._onRoute(window.location.pathname);
    }).bind(this);

    const pathname = window.location.pathname;
    const route = this.getRoute(pathname);

    if (!route) {
      console.warn(`Страница ${pathname} не найдена. Редирект на /not-found`);
      this.go("/not-found");
      return;
    }

    const isAuthenticated = await this.checkAuth();

    const isPublicRoute = [
      "/sign-up",
      "/register",
      "/500",
      "/not-found",
    ].includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      console.warn(`Неавторизованный доступ: ${pathname}. Редирект на /login`);
      this.go("/sign-up");
      return;
    }

    this._onRoute(pathname);
  }

  private async _onRoute(pathname: string): Promise<void> {
    const route = this.getRoute(pathname);

    if (!route) {
      console.warn(`Маршрут не найден: ${pathname}, редирект на /not-found`);
      this.go("/not-found");
      return;
    }

    const isAuthenticated = await this.checkAuth();

    const isPublicRoute = [
      "/sign-up",
      "/register",
      "/500",
      "/not-found",
    ].includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      console.warn(`Неавторизованный доступ: ${pathname}, редирект на /login`);
      this.go("/sign-up");
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    if (window.location.pathname !== pathname) {
      this.history.pushState({}, "", pathname);
    }
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

  private async checkAuth(): Promise<boolean> {
    try {
      const user = await authService.getUser();
      store.set("user", user);
      console.log("Пользователь авторизован:", user);
      return true;
    } catch (error) {
      console.warn("Пользователь не авторизован");
      return false;
    }
  }

  // Обработка кликов по ссылкам без перезагрузки
  private handleLinkClicks(): void {
    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.classList.contains("navbar__link")) {
        e.preventDefault();
        const href = target.getAttribute("href");
        if (href) {
          const url = new URL(href, window.location.origin);
          this.go(url.pathname);
        }
      }
    });
  }
}
