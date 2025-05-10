import Block, { BlockProps } from "../../../framework/Block";
import { AppState } from "../../../framework/Store";
import { connect } from "../../../utils/connect";
import isEqual from "../../../utils/isEqual";
import ChatItem from "../chatItem/ChatItem";
import template from "./ChatsList.hbs?raw";

interface ChatPreview {
  id: number;
  name: string;
  selected: boolean;
}

interface ChatsListProps extends BlockProps {
  chatItems?: ChatPreview[];
  selectedChatId?: number | null;
  onChatClick?: (id: number) => void;
  chatsList?: ChatItem[];
}

class ChatsListBase extends Block<ChatsListProps> {
  constructor(props: ChatsListProps) {
    const chatItems = props.chatItems || [];

    const chatsList = chatItems.map(
      (chat) =>
        new ChatItem({
          id: chat.id,
          name: chat.name,
          selected: chat.selected,
          events: {
            click: () => props.onChatClick?.(chat.id),
          },
        }),
    );

    super("div", {
      ...props,
      chatsList,
    });
  }

  componentDidUpdate(
    oldProps: ChatsListProps,
    newProps: ChatsListProps,
  ): boolean {
    const oldItems = oldProps.chatItems ?? [];
    const newItems = newProps.chatItems ?? [];

    if (!isEqual(oldItems, newItems)) {
      const chatsList = newItems.map(
        (chat) =>
          new ChatItem({
            id: chat.id,
            name: chat.name,
            selected: chat.selected,
            events: {
              click: () => newProps.onChatClick?.(chat.id),
            },
          }),
      );

      this.setProps({ chatsList });
      return true;
    }

    return false;
  }

  render(): string {
    return template;
  }
}

const mapStateToProps = (state: AppState) => {
  const chats = state.chats || [];
  const selectedChatId = state.selectedChatId;

  return {
    chatItems: chats.map((chat) => ({
      id: chat.id,
      name: String(chat.title),
      selected: chat.id === selectedChatId,
    })),
    selectedChatId,
  };
};

export default connect<ChatsListProps>(mapStateToProps)(ChatsListBase);
