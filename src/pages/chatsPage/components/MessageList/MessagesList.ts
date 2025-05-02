import Block, { BlockProps } from "../../../../framework/Block";
import { AppState } from "../../../../framework/Store";
import { connect } from "../../../../utils/connect";
import template from "./MessagesList.hbs?raw";

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
}

class MessagesList extends Block<MessagesListProps> {
  constructor(props: MessagesListProps) {
    super("ul", props);
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

  const messages: Message[] = messagesRaw
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .map((msg) => {
      const isMyMessage = msg.user_id === userId;
      return {
        ...msg,
        id: msg.id,
        time: new Date(msg.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMyMessage,
      };
    });

  return {
    messages,
    userId,
  };
};

export default connect<MessagesListProps>(mapStateToProps)(MessagesList);
