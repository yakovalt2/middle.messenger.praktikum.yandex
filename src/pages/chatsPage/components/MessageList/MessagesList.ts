import Block, { BlockProps } from "../../../../framework/Block";
import { AppState } from "../../../../framework/Store";
import { connect } from "../../../../utils/connect";
import template from "./MessagesList.hbs?raw";

interface MessagesListProps extends BlockProps {
  messages: {
    content: string;
    time: string;
    isMyMessage: boolean;
  }[];
}

class MessagesList extends Block<MessagesListProps> {
  constructor(props: MessagesListProps) {
    super("ul", {
      ...props,
      messages: props.messages.map((msg) => ({
        content: msg.content,
        time: new Date(msg.time).toLocaleTimeString(),
        isMyMessage: true //поменять
      })),
    });
  }

  render() {
    return template;
  }
}

const mapStateToProps = (state: AppState) => {
  const selectedChatId = state.selectedChatId;
  const chatMessagesEntry = state.chatsMessages.find((c) => c.id === selectedChatId);

  return {
    messages: chatMessagesEntry ? chatMessagesEntry.messages : [],
  };
};

export default connect(mapStateToProps)(MessagesList);
