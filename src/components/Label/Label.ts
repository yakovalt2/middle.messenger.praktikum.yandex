import Block from "../../utils/Block";
import template from "./Label.hbs?raw";
import "./Label.scss";

interface LabelProps {
  [key: string]: unknown;
  forAttr: string;
  text: string;
}

export default class Label extends Block<LabelProps> {
  constructor(props: LabelProps) {
    super("label", props);
  }

  render(): string {
    return template
  }
}
