import Block from "../../utils/Block";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { validateField } from "../../utils/validation"; 
import template from "./login.hbs?raw";

export default class LoginPage extends Block {
  constructor() {
    const loginInput = new Input({
      id: "login",
      type: "text",
      name: "login", 
      placeholder: "Введите логин",
      className: "login-input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement), 
      },
    });

    const passwordInput = new Input({
      id: "password",
      type: "password",
      name: "password",
      placeholder: "Введите пароль",
      className: "password-input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement), 
      },
    });

    const submitButton = new Button({
      id: "button",
      label: "Войти",
      className: "submit-button",
      type: "button",
      events: {
        click: () => this.handleSubmit(),
      },
    });

    super("div", { loginInput, passwordInput, submitButton });
  }

  handleFieldBlur(input: HTMLInputElement): void {
    this.validateField(input);  
  }

  handleSubmit() {
    const inputs = Array.from(
      this.getContent()?.querySelectorAll("input") || []
    ) as HTMLInputElement[];

    const formData: Record<string, string> = {};
    
    const isValid = inputs.every((input) => {
      const valid = this.validateField(input);
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

  validateField(input: HTMLInputElement): boolean {
    return validateField(input);  
  }

  render(): string {
    return template;
  }
}
