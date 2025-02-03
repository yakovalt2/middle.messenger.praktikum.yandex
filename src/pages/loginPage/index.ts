import Block from "../../utils/Block";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { validateField } from "../../utils/validation";
import AuthService from "../../api/services/AuthService";
import template from "./login.hbs?raw";
import Router from "../../utils/Router";

const authService = new AuthService();
const router = new Router("#app");

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

  async handleSubmit() {
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

      try {
        await authService.login({
          login: formData.login,
          password: formData.password,
        });

        console.log("Login successful, verifying session...");

        const user = await authService.getUser();
        console.log("Authenticated user:", user);

        console.log("Redirecting to /chats...");
        router.go("/chats");
      } catch (error) {
        console.error("Login failed:", error);
      }
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
