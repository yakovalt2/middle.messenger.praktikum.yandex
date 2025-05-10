import Block, { BlockProps } from "../framework/Block";
import Button from "./Button/Button";

export default class Navigation extends Block<BlockProps> {
  constructor() {
    super("nav", {
      isOpen: false,
      events: {
        click: (e: Event) => this.handleClick(e),
      },
      logoutButton: new Button({
        id: "logoutButton",
        label: "Выйти",
        events: { click: () => this.handleLogout() },
      }),
    });
  }

  handleClick(e: Event) {
    const target = e.target as HTMLElement;

    if (target.classList.contains("navbar__toggle")) {
      this.setProps({ isOpen: !this.props.isOpen });
      return;
    }
  }

  handleLogout() {
    console.log("handle Logout");
  }
  
  render(): string {
    return `
      <nav class="navbar">
        <button class="navbar__toggle">Открыть меню</button>
        <ul class="navbar__list ${this.props.isOpen ? "open" : "hidden"}">
          <li class="navbar__item"><a href="/sign-up" class="navbar__link">Логин</a></li>
          <li class="navbar__item"><a href="/register" class="navbar__link">Регистрация</a></li>
          <li class="navbar__item"><a href="/messenger" class="navbar__link">Чаты</a></li>
          <li class="navbar__item"><a href="/settings" class="navbar__link">Настройки</a></li>
          <li class="navbar__item"><a href="/500" class="navbar__link">Ошибка 500</a></li>
          <li class="navbar__item"><a href="/not-found" class="navbar__link">Ошибка 404</a></li>
        </ul>
      </nav>
    `;
  }
}
