


function notNull<T, K extends keyof T>(target: [T[K]] extends [string] ? T : never, propertyKey: K) { }

class Data1 { @notNull name!: string; } // No error.
const createSlice = (v: any) => {
    console.log(v);
    return v;
}

type typedef = { [key: string]: { [key: string]: unknown } };

type FunctionNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

const a = {
    b: 54,
    c: 55,
    d: () => {

    }
}

type reduxthunkdef<T, STORE extends BaseReduxWrapper> = (state: Pick<STORE, "initialState">, actions: Pick<STORE, FunctionNames<STORE>>, store: { a: 454 }) => Promise<void>;

type RRState<STORE extends BaseReduxWrapper> = Pick<STORE, "initialState">;
type RRActions<STORE extends BaseReduxWrapper> = Pick<STORE, FunctionNames<STORE>>;
type RRStore<STORE extends BaseReduxWrapper> = { a: 545 };

export abstract class BaseReduxWrapper {
    abstract get name(): string;

    abstract get initialState(): Record<string, unknown>;
    protected __FUNS__:  { [key: string]: Function } = {};

    public __V__() {
        const ownProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        const that: typedef = this as unknown as typedef;
        const functions = ownProperties.filter((property) =>
            typeof that[property] === 'function' &&
            property !== 'constructor' &&
            that[property].__UNSAFE_REDUCER)
            .reduce((el, d) => {
            //@ts-ignore
            el[d] = this[d] as Function;
            return el;
        }, {});
        this.__FUNS__ = functions;
        return createSlice({
            name: this.name,
            initialState: this.initialState,
            reducers: {
                ...functions,
            },
        });
    }
}

export function ReduxFactory(name: string): any {
    return (target: any) => {
        if (target === void 0) {
            throw new Error('this is not factory!')
        }
        target.prototype.__UNSAFE_REDUX_FACTORY = {
            IS_REDUX_WRAPPED: true,
            NAMING: name,
        };
    }
}

export function ReduxMethod(): any {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (target === void 0) {
            throw new Error('this controller is not correct!')
        }
        console.log(target, key, target[key], descriptor)
        const originalValue = target;
        descriptor.value = function (state: any, action: any) {
            originalValue(state, action)
        }
        descriptor.value.__UNSAFE_REDUCER = true;
    }
}

export function ReduxThunk<State>(target: (state: State) => Promise<void>, key: string) {
        if (target === void 0) {
            throw new Error('this controller is not correct!')
        }
        const storeD = {};
        return target;
}

@ReduxFactory("nameee")
class UserReduxStore extends BaseReduxWrapper {
    public get name(): string {
        return "NAME"
    }
    get initialState() {
        return {
            name: "",
        };
    }

    @ReduxMethod()
    public async aboba(state: RRState<this>, action: RRActions<this>, store: RRStore<this>): Promise<void> {
        console.log("brhu", state.initialState.name, action, store.a);
    }

    // @ReduxThunk
    // public async aboba2(state): Promise<void> {
    //     console.log('1234');
    // }

}

const user = new UserReduxStore();

user.__V__();
