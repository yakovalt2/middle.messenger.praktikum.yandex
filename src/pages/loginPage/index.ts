import Block from "../../framework/Block";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { validateField } from "../../utils/validation";
import template from "./login.hbs?raw";
import store from "../../framework/Store";
import { chatService, authService, router } from "../../api/services/index";

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
      try {
        store.clear();

        await authService.login({
          login: formData.login,
          password: formData.password,
        });

        const user = await authService.getUser();
        store.set("user", user);

        const chats = await chatService.getChats();
        store.set("chats", chats);

        router.go("/messenger");
      } catch (error: any) {
        if (error.reason === "User already in system") {
          const user = await authService.getUser();
          store.set("user", user);

          const chats = await chatService.getChats();
          store.set("chats", chats);

          router.go("/messenger");
        } else {
          console.error("Login failed:", error);
        }
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
