import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Block from "../../utils/Block";
import ChatItem from "../chatsPage/chatItem/ChatItem";
import template from './chats.hbs?raw';
import { validateField } from "../../utils/validation";

export default class ChatsPage extends Block {
  constructor() {
    const chats = [
      new ChatItem({
        name: "Чат 1",
        lastMessage: "Привет!",
        timestamp: "12:00",
      }),
      new ChatItem({
        name: "Чат 2",
        lastMessage: "Как дела?",
        timestamp: "13:00",
      }),
    ];

    const messageInput = new Input({
      id: "message",
      type: "message",
      name: "message",
      placeholder: "Введите сообщение",
      className: "message-input",
      events: {
        blur: (e: Event) => this.handleFieldBlur(e.target as HTMLInputElement),
      },
    })

    const sendButton = new Button({
      id: "sendButton",
      label: "Отправить",
      className: "send-button"
    })

    const chatsHTML = chats.map((chat) => chat.getContent()?.outerHTML || "");

    super("div", {
      chatsHTML,
      messageInput,
      sendButton,
      selectedChat: null,
      messages: [],
    });
  }

  render(): string {
    return template;
  }

  selectChat(chatName: string) {
    this.setProps({
      selectedChat: chatName,
      messages: [
        { user: "User", text: "Привет!" },
        { user: "Me", text: "Как дела?" },
      ],
    });
  }

  handleFieldBlur(input: HTMLInputElement): void {
    this.validateField(input);  
  }

  validateField(input: HTMLInputElement): boolean {
      return validateField(input);  
    }

  sendMessage(message: string) {
    if (message.trim() === "") return;
    //
  }
}
