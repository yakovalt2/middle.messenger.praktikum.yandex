import Block, { BlockProps } from "../../utils/Block";
import template from "./Button.hbs?raw";
import "./Button.scss"

interface ButtonProps extends BlockProps {
  id?: string;
  label: string;
  type?: "button" | "submit" | "reset"; 
  className?: string; 
  disabled?: boolean; 
}

export default class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super("div", props);
  }

  render(): string {
    return template
  }
}
