import Block, { BlockProps } from "../framework/Block";

export default class Navigation extends Block<BlockProps> {
  constructor() {
    super("nav", {
      isOpen: false,
      events: {
        click: (e: Event) => this.handleToggleMenu(e),
      },
    });
  }

  handleToggleMenu(e: Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains("navbar__toggle")) {
      this.setProps({ isOpen: !this.props.isOpen });
    }
  }

  render(): string {
    return `
      <nav class="navbar">
        <button class="navbar__toggle">Открыть меню</button>
        <ul class="navbar__list ${this.props.isOpen ? "open" : "hidden"}">
          <li class="navbar__item"><a href="/login" class="navbar__link">Логин</a></li>
          <li class="navbar__item"><a href="/register" class="navbar__link">Регистрация</a></li>
          <li class="navbar__item"><a href="/chats" class="navbar__link">Чаты</a></li>
          <li class="navbar__item"><a href="/settings" class="navbar__link">Настройки</a></li>
          <li class="navbar__item"><a href="/500" class="navbar__link">Ошибка 500</a></li>
          <li class="navbar__item"><a href="/not-found" class="navbar__link">Ошибка 404</a></li>
        </ul>
      </nav>
    `;
  }
}
