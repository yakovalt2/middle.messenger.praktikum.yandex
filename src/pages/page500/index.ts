import Block from "../../utils/Block"; 
import template from "./page500.hbs?raw"; 
import Button from "../../components/Button/Button"; 

export default class Page500 extends Block {
  constructor() {
    const button = new Button({
      id: "go-home",
      className: "page-500__button",
      type: "button",
      label: "Вернуться на главную",
      events: {
        click: () => {
          window.location.href = "/"; // Перенаправление на главную
        },
      },
    });

    super("div", {
      title: "500",
      message: "Внутренняя ошибка сервера.",
      button,
    });
  }

  render(): string {
    return template;
  }
}
