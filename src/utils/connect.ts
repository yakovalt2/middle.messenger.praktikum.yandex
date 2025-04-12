import Block from "../framework/Block";
import store, { StoreEvents, AppState } from "../framework/Store";
import isEqual from "../utils/isEqual";

export function connect<TProps extends Record<string, unknown>>(
  mapStateToProps: (state: AppState) => Partial<TProps>
) {
  return function <C extends new (...args: any[]) => Block<TProps>>(Component: C) {
    return class extends Component {
      private currentMappedProps: Partial<TProps>;

      constructor(...args: any[]) {
        const [props = {}] = args;

        const stateProps = mapStateToProps(store.getState());
        const combinedProps = { ...props, ...stateProps };

        super(combinedProps);
        this.currentMappedProps = stateProps;

        store.on(StoreEvents.Updated, () => {
          const newStateProps = mapStateToProps(store.getState());

          if (!isEqual(this.currentMappedProps, newStateProps)) {
            this.currentMappedProps = newStateProps;
            this.setProps({
              ...this.props,
              ...newStateProps,
            });
          }
        });
      }
    };
  };
}
