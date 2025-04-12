import Block, { BlockProps } from "../../../../framework/Block";
import template from "./MessageItem.hbs?raw";

interface MessageItemProps extends BlockProps {
  content: string;
  time: string;
  isMyMessage: boolean;
}

class MessageItem extends Block<MessageItemProps> {
  constructor(props: MessageItemProps) {
    super("li", props);  
  }

  render() {
    return template;
  }
}

export default MessageItem;
