import Block, { BlockProps } from "../../../framework/Block";
import { chatService } from "../../../api/services";
import template from "./ChatItem.hbs?raw";
import store from "../../../framework/Store";

interface ChatItemProps extends BlockProps {
  id: number;
  name: string;
  selected: boolean;
}

class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super("li", {
      ...props,
      events: {
        click: () => this.handleChatClick(),
      },
    });
  }

  async handleChatClick() {
    const { id, name, selected } = this.props;
    console.log("Chat clicked:", { id, name, selected });

    try {
      chatService.disconnect();

      store.set("chatsMessages", []);
      store.set("selectedChatId", id);

      const token = await chatService.getChatToken(id);

      const userId = store.getState().user?.id;

      if (!userId) {
        console.error("Нет userId. Пользователь не авторизован?");
        return;
      }

      chatService.connectToChat(userId, id, token, (message) => {
        if (Array.isArray(message)) {
          message.forEach((msg) => {
            if (msg.type === "message") {
              this.addMessageToStore(id, msg);
            }
          });
        } else if (message.type === "message") {
          this.addMessageToStore(id, message);
        }
      });
    } catch (error) {
      console.error("Failed to get chat token or connect to WebSocket:", error);
    }
  }

  // Добавление сообщения в store
  addMessageToStore(chatId: number, message: any) {
    const currentState = store.getState();
    const chatEntry = currentState.chatsMessages.find((c) => c.id === chatId);

    if (chatEntry) {
      store.set(
        "chatsMessages",
        currentState.chatsMessages.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, message] } : c,
        ),
      );
    } else {
      store.set("chatsMessages", [
        ...currentState.chatsMessages,
        { id: chatId, messages: [message] },
      ]);
    }
  }
  render(): string {
    return template;
  }
}

export default ChatItem;
