import Block from "../../utils/Block";
import ChatItem from "../chatsPage/chatItem/ChatItem";
import template from './chats.hbs?raw'

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
    
    const chatsHTML = chats.map((chat) => chat.getContent()?.outerHTML || "");

    super("div", { chatsHTML });
  }

  render(): string {
    return template;
  }
}
