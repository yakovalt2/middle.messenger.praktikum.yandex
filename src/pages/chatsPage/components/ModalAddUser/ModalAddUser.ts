import Block, { BlockProps } from "../../../../framework/Block";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import { chatService } from "../../../../api/services";
import store from "../../../../framework/Store";
import template from "./ModalAddUser.hbs?raw";
import "./ModalAddUser.scss";
import showToast from "../../../../utils/showToast";

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

    if (!input) {
      console.error("Ошибка: не найден инпут для ID пользователя");
      return;
    }

    const userId = Number(input.value);
    const chatId = store.getState().selectedChatId;
    const currentUserId = store.getState().user?.id;

    console.log(currentUserId);
    console.log(userId)

    if (!userId || !chatId) {
      console.error("Ошибка: не выбран чат или не введён userId");
      return;
    }

    if (userId === currentUserId) {
      console.log("Ошибка: Невозможно добавить себя в чат");
      return;
    }

    try {
      console.log("Пытаемся получить токен...");
      await chatService.addUserToChat(userId, chatId);

      const token = await chatService.getChatToken(chatId);
      console.log("Получен токен:", token); 

      if (!token || typeof token !== "string") {
        console.log("Ошибка: Токен невалиден или не строка", { token });
        return;
      }

      chatService.connectToChat(userId, chatId, token, (message) => {
        console.log("Пытаемся подключитсья");
        try {
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
        } catch (err) {
          console.error("Ошибка при обработке сообщения:", err);
        }
      });

      showToast(`Пользователь ${userId} добавлен в чат`, "success")

      this.props.onClose();
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error, {
        userId,
        chatId,
      });
      showToast(`Ошибка добавления пользователя ${userId} в чат`, "error")
    }
  }

  render(): string {
    return template;
  }
}

export default ModalAddUser;