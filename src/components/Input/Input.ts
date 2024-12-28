import Block, { BlockProps } from "../../utils/Block";
import template from "./Input.hbs?raw";
import "./Input.scss";

interface InputProps extends BlockProps {
  type: string;       
  id: string;         
  className?: string; 
  name: string;
  placeholder?: string; 
  value?: string;
  events?: {
    [key: string]: (event: Event) => void;
  };
}

export default class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super("div", props, {
      elementForEvents: "input"
    });
  }

  render(): string {
    return template;
  }
}
