import Block, { BlockProps } from "../../../../framework/Block";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import { chatService } from "../../../../api/services";
import store from "../../../../framework/Store";
import template from "./ModalAddUser.hbs?raw";
import "./ModalAddUser.scss";

interface ModalAddUserProps extends BlockProps {
  onClose: () => void;
}

class ModalAddUser extends Block<ModalAddUserProps> {
  constructor(props: ModalAddUserProps) {
    super("div", {
      ...props,
      input: new Input({
        id: "addUserInput",
        type: "text",
        name: "addUser",
        placeholder: "ID пользователя",
      }),
      addButton: new Button({
        label: "Добавить",
        events: {
          click: () => this.handleAddUser(),
        },
      }),
      closeButton: new Button({
        label: "Закрыть",
        events: {
          click: () => this.props.onClose(),
        },
      }),
    });
  }

  async handleAddUser() {
    const input = this.getContent()?.querySelector(
      "#addUserInput"
    ) as HTMLInputElement;
    const userId = Number(input.value);
    const chatId = store.getState().selectedChatId;

    if (!userId || !chatId) {
      console.error("Не выбран чат или не введён userId");
      return;
    }

    try {
      await chatService.addUserToChat(userId, chatId);

      // Подключение к чату
      const token = await chatService.getChatToken(chatId);
      chatService.connectToChat(userId, chatId, token, (message) => {
        if (Array.isArray(message)) {
          store.set("messages", [
            ...(store.getState().chatsMessages || []),
            ...message,
          ]);
        } else {
          store.set("messages", [
            ...(store.getState().chatsMessages || []),
            message,
          ]);
        }
      });

      this.props.onClose();
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  }

  render(): string {
    return template;
  }
}

export default ModalAddUser;
