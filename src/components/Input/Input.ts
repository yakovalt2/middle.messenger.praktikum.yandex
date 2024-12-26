import Block from "../../utils/Block";
import template from "./Input.hbs?raw";
import './Input.scss';

interface InputProps {
  type: string;       
  id: string;        
  className?: string; 
  name: string;
  placeholder?: string; 
  value?: string;
}

export default class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super("div", props); 
  }

  render(): string {
    return template; 
  }
}
