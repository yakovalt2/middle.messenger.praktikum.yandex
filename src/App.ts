import LoginPage from "./pages/loginPage/index";
import RegisterPage from "./pages/registerPage";
import ChatsPage from "./pages/chatsPage";
import SettingsPage from "./pages/settingsPage";
import Page404 from "./pages/page404";
import Page500 from "./pages/page500";
import Router from "./utils/Router";

export default class App {
  private router: Router;

  constructor() {
    this.router = new Router("#app");
    this.initRoutes();
    this.router.start();
  }

  private initRoutes(): void {
    this.router
      .use("/", LoginPage)
      .use("/login", LoginPage)
      .use("/register", RegisterPage)
      .use("/chats", ChatsPage)
      .use("/settings", SettingsPage)
      .use("/500", Page500)
      .use("/not-found", Page404);
  }
}
