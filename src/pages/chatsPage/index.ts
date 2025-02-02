import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Block from "../../utils/Block";
import ChatItem from "../chatsPage/chatItem/ChatItem";
import template from "./chats.hbs?raw";
import { validateField } from "../../utils/validation";
import AuthService from "../../api/services/AuthService";
import ChatService from "../../api/services/ChatService";
import Router from "../../utils/Router";

const authService = new AuthService();
const chatService = new ChatService();
const router = new Router("#app");

export default class ChatsPage extends Block {
  constructor() {
    super("div", {
      chats: [],
      messageInput: new Input({
        id: "message",
        type: "text",
        name: "message",
        placeholder: "Введите сообщение",
        className: "message-input",
      }),
      sendButton: new Button({
        id: "sendButton",
        label: "Отправить",
        className: "send-button",
      }),
      logoutButton: new Button({
        id: "logoutButton",
        label: "Выйти",
        className: "logout-button",
        events: {
          click: () => this.handleLogout(),
        },
      }),
      createChatInput: new Input({
        id: "createChat",
        type: "text",
        name: "createChat",
        placeholder: "Название чата",
        className: "create-chat-input",
      }),
      createChatButton: new Button({
        id: "createChatButton",
        label: "Создать чат",
        className: "create-chat-button",
        events: {
          click: () => this.handleCreateChat(),
        },
      }),
    });

    this.loadChats();
  }

  async loadChats() {
    try {
      const chats = await chatService.getChats();
      console.log("Чаты загружены:", chats);

      this.setProps({
        chats: chats.map(
          (chat) =>
            new ChatItem({
              name: chat.title,
              lastMessage: chat.last_message?.content || "Нет сообщений",
              timestamp: chat.last_message?.time || "",
            })
        ),
      });
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  }

  async handleCreateChat() {
    const chatTitle = (
      this.getContent()?.querySelector("#createChat") as HTMLInputElement
    )?.value;

    if (!chatTitle) {
      console.error("Введите название чата!");
      return;
    }

    try {
      await chatService.createChat(chatTitle);
      console.log("Чат успешно создан:", chatTitle);
      this.loadChats();
    } catch (error) {
      console.error("Ошибка создания чата:", error);
    }
  }

  async handleLogout() {
    try {
      await authService.logout();
      console.log("Успешный выход");
      router.go("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  }

  render(): string {
    return template;
  }
}
