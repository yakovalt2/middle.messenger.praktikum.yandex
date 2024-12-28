import Block, { BlockProps } from "../utils/Block"

export default class Navigation extends Block<BlockProps> {
  constructor() {
    super("nav", {});
  }

  render(): string {
    return `
      <nav class="navbar flex align-center">
        <p class="navbar__message">Выберите страницу:</p>
        <ul class="navbar__list flex">
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
