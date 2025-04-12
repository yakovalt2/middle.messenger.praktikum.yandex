import Block from "../../framework/Block";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { validateField } from "../../utils/validation";
import template from "./register.hbs?raw";
import AuthService from "../../api/services/AuthService";
import Router from "../../framework/Router";

const authService = new AuthService();

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

  async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const inputs = Array.from(
      this.getContent()?.querySelectorAll("input") || [],
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
      try {
        await authService.register({
          first_name: formData.first_name,
          second_name: formData.second_name,
          login: formData.login,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });

        console.log(formData);

        console.log("✅ Регистрация успешна, переходим в чаты...");
        const router = new Router("#app");
        router.go("/chats");
      } catch (error: any) {
        if (error.message.includes("409")) {
          console.warn("Пользователь уже зарегистрирован, переходим в чаты");
          const router = new Router("#app");
          router.go("/chats");
          console.error("Ошибка регистрации:", error);
        } else {
          console.error("Ошибка регистрации:", error);
        }
      }
    } else {
      console.error("Валидация не пройдена!");
    }
  }

  render(): string {
    return template;
  }
}
