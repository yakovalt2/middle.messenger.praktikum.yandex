import Block from "../../utils/Block";
import Input from "../../components/Input/Input";
import Avatar from "../../components/Avatar/Avatar";
import template from "./settings.hbs?raw";
import "./settings.scss";
import Button from "../../components/Button/Button";
import { validateField } from "../../utils/validation";
import AuthService from "../../api/services/AuthService";
import "./settings.scss";

const authService = new AuthService();

export default class SettingsPage extends Block {
  constructor() {
    const firstNameInput = new Input({
      id: "first_name",
      type: "text",
      name: "first_name",
      placeholder: "Имя",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const secondNameInput = new Input({
      id: "second_name",
      type: "text",
      name: "second_name",
      placeholder: "Фамилия",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const displayNameInput = new Input({
      id: "display_name",
      type: "text",
      name: "display_name",
      placeholder: "Имя в чате",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const loginInput = new Input({
      id: "login",
      type: "text",
      name: "login",
      placeholder: "Логин",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const emailInput = new Input({
      id: "email",
      type: "email",
      name: "email",
      placeholder: "Email",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const phoneInput = new Input({
      id: "phone",
      type: "tel",
      name: "phone",
      placeholder: "Телефон",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const oldPasswordInput = new Input({
      id: "oldPassword",
      type: "password",
      name: "old_password",
      placeholder: "Старый пароль",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const newPasswordInput = new Input({
      id: "newPassword",
      type: "password",
      name: "new_password",
      placeholder: "Новый пароль",
      value: "",
      className: "input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    });

    const avatarImage = new Avatar({
      className: "settings__avatar-image",
      alt: "User Avatar",
      src: "",
    });

    const avatarInput = new Input({
      id: "avatar",
      type: "file",
      name: "avatar",
      className: "input-avatar",
      hidden: true,
      events: {
        change: (e: Event) => this.handleAvatarChange(e),
      },
    });

    const saveButton = new Button({
      id: "button",
      label: "Сохранить",
      className: "save-button",
      type: "button",
      events: {
        click: (e: Event) => this.handleSubmit(e),
      },
    });

    super("main", {
      firstNameInput,
      secondNameInput,
      displayNameInput,
      loginInput,
      emailInput,
      phoneInput,
      oldPasswordInput,
      newPasswordInput,
      avatarInput,
      avatarImage,
      saveButton,
    });

    this.loadUserData();
  }

  async loadUserData() {
    try {
      const user = await authService.getUser();

      console.log(`https://ya-praktikum.tech/api/v2/resources${user.avatar}`);
      const avatarUrl = user.avatar
        ? `https://ya-praktikum.tech/api/v2/resources${encodeURIComponent(user.avatar)}`
        : "https://via.placeholder.com/150";

      this.setProps({
        firstNameInput: new Input({
          id: "first_name",
          type: "text",
          name: "first_name",
          placeholder: "Имя",
          value: user.first_name,
          className: "input",
        }),
        secondNameInput: new Input({
          id: "second_name",
          type: "text",
          name: "second_name",
          placeholder: "Фамилия",
          value: user.second_name,
          className: "input",
        }),
        displayNameInput: new Input({
          id: "display_name",
          type: "text",
          name: "display_name",
          placeholder: "Имя в чате",
          value: user.display_name || "",
          className: "input",
        }),
        loginInput: new Input({
          id: "login",
          type: "text",
          name: "login",
          placeholder: "Логин",
          value: user.login,
          className: "input",
        }),
        emailInput: new Input({
          id: "email",
          type: "email",
          name: "email",
          placeholder: "Email",
          value: user.email,
          className: "input",
        }),
        phoneInput: new Input({
          id: "phone",
          type: "tel",
          name: "phone",
          placeholder: "Телефон",
          value: user.phone,
          className: "input",
        }),
        avatarImage: new Avatar({
          className: "settings__avatar-image",
          alt: "User Avatar",
          src: avatarUrl,
        }),
      });

      console.log("Данные пользователя загружены:", user);
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
    }
  }

  handleFieldBlur(input: HTMLInputElement): void {
    validateField(input);
  }

  async handleSubmit(e: Event) {
    e.preventDefault();

    console.log("ass");

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
      try {
        await authService.updateUserProfile({
          first_name: formData.first_name,
          second_name: formData.second_name,
          display_name: formData.display_name,
          login: formData.login,
          email: formData.email,
          phone: formData.phone,
        });

        console.log("Данные успешно обновлены!");
      } catch (error) {
        console.error("Ошибка обновления данных:", error);
      }
    } else {
      console.error("Ошибка валидации формы");
    }
  }

  async handleAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.warn("Файл не выбран");
      return;
    }

    const file = input.files[0];
    console.log("Выбранный файл:", file);

    try {
      const response = await authService.updateAvatar(file);
      console.log("Ответ сервера:", response);

      if (response.avatar) {
        console.log("Аватар обновлен, перезагружаем данные...");
        await this.loadUserData(); 
      } else {
        console.warn("Сервер не вернул URL аватара");
      }
    } catch (error) {
      console.error("Ошибка смены аватара:", error);
    }
  }

  render(): string {
    return template;
  }
}
