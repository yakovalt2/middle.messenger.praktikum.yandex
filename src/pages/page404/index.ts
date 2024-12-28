import Block from "../../utils/Block"; 
import template from "./page404.hbs?raw"; 
import Button from "../../components/Button/Button"; 

export default class Page404 extends Block {
  constructor() {
    const button = new Button({
      id: "go-home",
      className: "page-404__button",
      type: "button",
      label: "Вернуться на главную",
      events: {
        click: () => {
          window.location.href = "/"; // Перенаправление на главную
        },
      },
    });

    super("div", {
      title: "404",
      message: "Страница не найдена.",
      button,
    });
  }

  render(): string {
    return template;
  }
}
