import Block from "../../utils/Block";
import template from "./Link.hbs?raw";
import "./Link.scss";

interface LinkProps {
  href: string;
  text: string;
  className?: string; 
  id?: string; 
  events?: Record<string, (event: Event) => void>; 
  [key: string]: unknown;
}

export default class Link extends Block<LinkProps> {
    constructor(props: LinkProps) {
        super('link', props)
    }

    render(): string {
        return template
    }
}
