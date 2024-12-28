import page from "page";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import Navigation from "./components/Navigation";
import Block from './utils/Block';
import ChatsPage from "./pages/chatsPage";
import SettingsPage from "./pages/settingsPage";
import Page404 from "./pages/page404";
import Page500 from "./pages/page500";

export default class App {
  private appElement: HTMLElement | null;
  private navigation: Navigation;

  constructor() {
    this.appElement = document.getElementById("app");
    this.navigation = new Navigation();
    this.initRoutes();
  }

  private initRoutes(): void {
    page("/", () => this.showPage(new LoginPage()));
    page("/login", () => this.showPage(new LoginPage()));
    page("/register", () => this.showPage(new RegisterPage()));
    page("/chats", () => this.showPage(new ChatsPage()));
    page("/settings", () => this.showPage(new SettingsPage()));
    page("/500", () => this.showPage(new Page500()));
    page("/not-found", () => this.showPage(new Page404));
    page();
  }

  private showPage(page: Block): void {
    if (!this.appElement) {
      console.error("App element not found");
      return;
    }

    this.appElement.innerHTML = "";

    const navContent = this.navigation.getContent();
    if (navContent) {
      this.appElement.appendChild(navContent);
    }

    const pageContent = page.getContent();
    if (pageContent) {
      this.appElement.appendChild(pageContent);
    }
  }
}
