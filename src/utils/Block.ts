import EventBus from "../utils/EventBus";
import Handlebars from "handlebars";

interface BlockMeta<TProps> {
  tagName: string;
  props: TProps;
}

export interface BlockProps {
  events?: {
    click?: (event: MouseEvent) => void;
  };
  elementForEvents?: string;
  [key: string]: unknown;
}

export default abstract class Block<TProps extends Record<string, unknown> = Record<string, unknown>> { 
  protected props: TProps;
  protected blockProps: BlockProps;
  private eventBus: EventBus<TProps>;
  private element: HTMLElement | null = null;
  private meta: BlockMeta<TProps>;

  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  constructor(tagName: string = "div", props: TProps, blockProps: BlockProps = {}) {
    this.meta = { tagName, props };
    this.props = this.makePropsProxy(props);
    this.blockProps = blockProps;

    this.eventBus = new EventBus<TProps>();

    this.registerEvents(this.eventBus);
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  private registerEvents(eventBus: EventBus<TProps>): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this.componentDidMountWrapper.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this.componentDidUpdateWrapper.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this.renderComponent.bind(this));
  }

  private init(): void {
    this.element = this.createDocumentElement(this.meta.tagName);
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private componentDidMountWrapper(): void {
    this.componentDidMount();
    Object.values(this.props).forEach((prop) => {
      if (prop instanceof Block) {
        prop.eventBus.emit(Block.EVENTS.FLOW_CDM);
      }
    });
  }

  protected componentDidMount(): void {}

  private componentDidUpdateWrapper(): void {  
    const shouldUpdate = this.componentDidUpdate();
    if (shouldUpdate) {
      this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(): boolean {
    return true;
  }

  private renderComponent(): void {
    if (!this.element) {
      console.warn("Element is not defined during render");
      return;
    }

    const propsWithStubs = this.preparePropsWithStubs();
    const compiledHTML = Handlebars.compile(this.render())(propsWithStubs);

    this.removeEvents();
    this.element.innerHTML = compiledHTML;

    this.addEvents();

    this.insertChildren();
  }

  protected abstract render(): string;

  private createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private makePropsProxy(props: TProps): TProps {
    return new Proxy(props, {
      get: (target, prop: string) => {
        const value = target[prop as keyof TProps];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set: (target, prop: string, value) => {
        const oldProps = { ...target };
        target[prop as keyof TProps] = value;
        this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      },
    });
  }

  protected addEvents(): void {
    const { events = {} } = this.props;
    const targetElement = this.getTargetElementForEvents();
  
    if (targetElement && typeof events === 'object' && events !== null) {
      Object.entries(events).forEach(([eventName, listener]) => {
        if (listener && typeof listener === 'function') {
          targetElement.addEventListener(
            eventName as keyof HTMLElementEventMap,
            listener
          );
        }
      });
    }
  }

  protected removeEvents(): void {
    const { events = {} } = this.props;
    const targetElement = this.getTargetElementForEvents();
  
    if (targetElement && typeof events === 'object' && events !== null) {
      Object.entries(events).forEach(([eventName, listener]) => {
        if (listener && typeof listener === 'function') {
          targetElement.removeEventListener(
            eventName as keyof HTMLElementEventMap,
            listener
          );
        }
      });
    }
  }

  private getTargetElementForEvents(): HTMLElement | null {
    if (!this.element) return null;

    const { elementForEvents } = this.blockProps;

    return elementForEvents
      ? this.element.querySelector(elementForEvents)
      : this.element;
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  public setProps(nextProps: Partial<TProps>): void {
    if (!nextProps) return;

    Object.assign(this.props, nextProps);
  }

  private preparePropsWithStubs(): Record<string, unknown> { 
    return Object.entries(this.props).reduce((acc, [key, value]) => {
      if (value instanceof Block) {
        acc[key] = `<div data-id="${key}"></div>`;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);
  }

  private insertChildren(): void {
    Object.entries(this.props).forEach(([key, value]) => {
      if (value instanceof Block) {
        const stub = this.element!.querySelector(`[data-id="${key}"]`);
        const content = value.getContent();
        if (stub && content) {
          stub.replaceWith(content);
        }
        value.eventBus.emit(Block.EVENTS.FLOW_CDM);
      }
    });
  }
}
