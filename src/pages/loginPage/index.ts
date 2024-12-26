import Block from "../../utils/Block";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import template from "./login.hbs?raw";

export default class LoginPage extends Block {
  constructor() {
    const loginInput = new Input({
      id: "login",
      type: "text",
      name: "login",
      placeholder: "Введите логин",
      className: "login-input",
    });

    const passwordInput = new Input({
      id: "password",
      type: "password",
      name: "password",
      placeholder: "Введите пароль",
      className: "password-input",
    });

    const submitButton = new Button({
      id: "button",
      label: "Войти",
      className: "submit-button",
      type: "button"
    })

    console.log(loginInput)

    super("div", { loginInput, passwordInput, submitButton });
  }

  render(): string {
    return template; 
  }
}
