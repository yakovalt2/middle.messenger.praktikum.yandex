import Block from "../../utils/Block";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { validateField } from "../../utils/validation";
import template from "./register.hbs?raw";

export default class RegisterPage extends Block {
  constructor() {
    const emailInput = new Input({
      id: "email",
      type: "text",
      name: "email",
      placeholder: "Введите почту",
      value: "",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const loginInput = new Input({
      id: "login",
      type: "text",
      name: "login",
      placeholder: "Введите логин",
      value: "",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const secondNameInput = new Input({
      id: "second_name",
      type: "text",
      name: "second_name",
      placeholder: "Введите фамилию",
      value: "",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const firstNameInput = new Input({
      id: "first_name",
      type: "text",
      name: "first_name",
      placeholder: "Введите имя",
      value: "",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const passwordInput = new Input({
      id: "password",
      type: "password",
      name: "password",
      placeholder: "Введите пароль",
      value: "",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const phoneInput = new Input({
      id: "phone",
      type: "text",
      name: "phone",
      placeholder: "Введите ваш телефон",
      value: "",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const registerButton = new Button({
      id: "register-btn", 
      type: "submit",
      label: "Регистрация",
      className: "primary-button",
      events: {
        click: (e: Event) => this.handleSubmit(e),
      },
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

  handleFieldBlur(input: HTMLInputElement): void {
    validateField(input);
  }

  handleSubmit(e: Event): void {
    e.preventDefault(); 

    const inputs = Array.from(
      this.getContent()?.querySelectorAll("input") || []
    ) as HTMLInputElement[];

    const formData: Record<string, string> = {};

    const isValid = inputs.every((input) => {
      const valid = validateField(input);
      if (valid) {
        formData[input.name] = input.value;
      }
      return valid;
    });

    if (isValid) {
      console.log("Form data:", formData);
    } else {
      console.error("Validation failed");
    }
  }

  render(): string {
    return template;
  }
}
