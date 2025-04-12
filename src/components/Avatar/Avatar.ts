import Block, { BlockProps } from "../../framework/Block";
import template from "./Avatar.hbs?raw";

interface AvatarProps extends BlockProps {
  id?: string;
  src?: string;
  className?: string;
  alt: string;
}

export default class Button extends Block<AvatarProps> {
  constructor(props: AvatarProps) {
    super("div", props);
  }

  render(): string {
    return template;
  }
}
