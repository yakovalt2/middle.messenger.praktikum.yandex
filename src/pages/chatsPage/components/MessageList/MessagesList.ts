import Block, { BlockProps } from "../../../../framework/Block";
import { AppState } from "../../../../framework/Store";
import { connect } from "../../../../utils/connect";
import template from "./MessagesList.hbs?raw";
import { chatService } from "../../../../api/services";
import store from "../../../../framework/Store";
import showToast from "../../../../utils/showToast";

interface Message {
  id: number;
  content: string;
  user_id: number;
  time: string;
  isMyMessage?: boolean;
  avatar?: string | null;
}

interface MessagesListProps extends BlockProps {
  userId: number;
  messages: Message[];
  chatUsers?: {
    id: number;
    first_name: string;
    second_name: string;
    avatar: string | null;
  }[];
}

class MessagesList extends Block<MessagesListProps> {
  constructor(props: MessagesListProps) {
    super("ul", props);
  }

  componentDidMount(): void {
    this.setupRemoveUserListeners();
  }

  componentDidUpdate(): boolean {
    this.setupRemoveUserListeners();
    return true;
  }

  setupRemoveUserListeners() {
    const container = this.getContent();
    if (!container) return;

    const buttons = container.querySelectorAll(".remove-user-btn");

    buttons.forEach((btn) => {
      const newBtn = btn.cloneNode(true) as HTMLElement;
      btn.replaceWith(newBtn);
      newBtn.addEventListener("click", async (e) => {
        const userId = Number((e.target as HTMLElement).dataset.userId);
        const chatId = store.getState().selectedChatId;
        if (!userId || !chatId) return;

        try {
          await chatService.removeUserFromChat(userId, chatId);
          const updatedUsers = await chatService.getUsers(chatId);
          store.set("chatUsers", updatedUsers);
          showToast("Пользователь удалён", "success");
        } catch (err) {
          console.error("Ошибка удаления пользователя:", err);
          showToast("Не удалось удалить пользователя", "error");
        }
      });
    });
  }

  render() {
    return template;
  }
}

const mapStateToProps = (state: AppState) => {
  const selectedChatId = state.selectedChatId;
  const userId = state.user?.id;
  const messagesRaw =
    state.chatsMessages.find((chat) => chat.id === selectedChatId)?.messages ||
    [];

  const usersInChat = state.chatUsers || [];

  const messages: Message[] = messagesRaw
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .map((msg) => {
      const isMyMessage = msg.user_id === userId;
      const sender = usersInChat.find((user) => user.id === msg.user_id);

      return {
        ...msg,
        time: new Date(msg.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMyMessage,
        avatar: sender?.avatar || null,
      };
    });

  return {
    messages,
    userId,
    chatUsers: usersInChat,
  };
};

export default connect<MessagesListProps>(mapStateToProps)(MessagesList);
