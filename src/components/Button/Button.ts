import Block from "../../utils/Block";
import template from "./Button.hbs?raw";
import "./Button.scss"

interface ButtonProps {
  id?: string;
  label: string;
  type?: "button" | "submit" | "reset"; 
  className?: string; 
  disabled?: boolean; 
  events?: {
    click?: (event: MouseEvent) => void; 
  };
}

export default class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super("div", props);
  }

  render(): string {
    return `
    <button id="{{id}}" class="button {{className}}" type="{{type}}">
  {{label}}
</button>
`
  }
}
