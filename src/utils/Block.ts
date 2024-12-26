import EventBus from "../utils/EventBus";
import Handlebars from "handlebars";

interface BlockMeta<TProps> {
  tagName: string;
  props: TProps;
}

export default abstract class Block<TProps extends Record<string, any> = {}> {
  protected props: TProps;
  private eventBus: EventBus;
  private element: HTMLElement | null = null;
  private meta: BlockMeta<TProps>;

  constructor(tagName: string = "div", props: TProps) {
    this.meta = { tagName, props };
    this.eventBus = new EventBus();
    this.props = this.makePropsProxy(props);

    this.registerEvents();
    this.eventBus.emit("init");
  }

  private registerEvents(): void {
    this.eventBus.on("init", this.init.bind(this));
    this.eventBus.on("flow:component-did-mount", this.componentDidMount.bind(this));
    this.eventBus.on("flow:component-did-update", this.componentDidUpdate.bind(this));
    this.eventBus.on("flow:render", this.renderComponent.bind(this));
  }

  private init(): void {
    this.element = this.createDocumentElement(this.meta.tagName);
    this.eventBus.emit("flow:render");
  }

  protected componentDidMount(): void {
    Object.values(this.props).forEach((prop) => {
      if (prop instanceof Block) {
        prop.eventBus.emit("flow:component-did-mount");
      }
    });
  }

  protected componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    return true;
  }

  private renderComponent(): void {
    if (!this.element) return;

    const propsWithStubs = this.preparePropsWithStubs();
    const compiledHTML = Handlebars.compile(this.render())(propsWithStubs);

    this.element.innerHTML = compiledHTML;

    this.addEvents();
    this.eventBus.emit("flow:component-did-mount");
  }

  protected abstract render(): string;

  private createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private makePropsProxy(props: TProps): TProps {
    const self = this;

    return new Proxy(props, {
      get(target, prop: string) {
        return target[prop as keyof TProps];
      },
      set(target, prop: string, value) {
        const oldProps = { ...target };
        target[prop as keyof TProps] = value;
        const shouldUpdate = self.componentDidUpdate(oldProps, target);
        if (shouldUpdate) {
          self.eventBus.emit("flow:render");
        }
        return true;
      },
    });
  }

  private addEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      if (this.element) {
        this.element.addEventListener(eventName, events[eventName]);
      }
    });
  }

  private removeEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      if (this.element) {
        this.element.removeEventListener(eventName, events[eventName]);
      }
    });
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  public setProps(nextProps: Partial<TProps>): void {
    if (!nextProps) return;

    Object.assign(this.props, nextProps);
  }

  private preparePropsWithStubs(): Record<string, any> {
    return Object.entries(this.props).reduce((acc, [key, value]) => {
      if (value instanceof Block) {
        acc[key] = value.getContent()?.outerHTML || ""; 
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  }
}
