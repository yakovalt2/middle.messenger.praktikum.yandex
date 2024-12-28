import Block from "../../../utils/Block";

interface ChatItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  [key: string]: unknown;
}

export default class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super("li", props);
  }

  render(): string {
    return `
      <div class="chat-item">
        <div class="chat-name">{{name}}</div>
        <div class="chat-last-message">{{lastMessage}}</div>
        <div class="chat-timestamp">{{timestamp}}</div>
      </div>
    `;
  }
}
