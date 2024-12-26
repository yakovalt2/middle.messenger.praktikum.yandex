import Block from "../../utils/Block";
import Input from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import Button from "../../components/Button/Button";
import template from "./register.hbs?raw";

export default class RegisterPage extends Block {
  constructor() {
    const emailInput = new Input({
      id: "email",
      type: "text",
      name: "email",
      placeholder: "Введите почту",
      value: "",
    });

    const loginInput = new Input({
      id: "login",
      type: "text",
      name: "login",
      placeholder: "Введите логин",
      value: "",
    });

    const secondNameInput = new Input({
      id: "second_name",
      type: "text",
      name: "second_name",
      placeholder: "Введите фамилию",
      value: "",
    });

    const firstNameInput = new Input({
      id: "first_name",
      type: "text",
      name: "first_name",
      placeholder: "Введите имя",
      value: "",
    });

    const passwordInput = new Input({
      id: "password",
      type: "password",
      name: "password",
      placeholder: "Введите пароль",
      value: "",
    });

    const phoneInput = new Input({
      id: "phone",
      type: "text",
      name: "phone",
      placeholder: "Введите ваш телефон",
      value: "",
    });

    const registerButton = new Button({
      id: "login-btn",
      type: "submit",
      label: "Регистрация",
      className: "primary-button",
    });

    super("main", {
      emailInput,
      loginInput,
      secondNameInput,
      firstNameInput,
      passwordInput,
      phoneInput,
      registerButton,
    });
  }

  render(): string {
    return template;
  }
}
