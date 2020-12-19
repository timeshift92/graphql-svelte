export function setHeaders(headers: any): void;
export function headers(): {
    'content-type': string;
};
/**
 * * Gets default client {@link svqlConfig} for a
 * [GraphQL Client]{@link svqlConfig}.
 * @param {*} url
 * @param {*} wsUrl
 * @param {{
 *   connectionCallback:string
 *   connectionParams:Object,
 *   timeout:number,
 *   reconnect:boolean,
 *   reconnectionAttempts:number,
 *   lazy:boolean,
 *   inactivityTimeout:number
 *   }} options
 */
export function getClient(url: any, wsUrl: any, wsOptions?: {}): {
    /**
     *
     * @param { query:string, variables:Object } client.subscription
     */
    subscription(query: any, variables: any): {
        [x: number]: () => any;
        subscribe(observerOrNext: any, onError: any, onComplete: any): {
            unsubscribe: () => void;
        };
    };
    /**
     * @param {SubscribeQL} client.sub
     */
    sub: import("./SubscribeQL").SubscriptionClient;
    /**
     *
     * @param {string} query
     * @param {Object} variables
     * @param {boolean} cache
     */
    mutate(query: string, variables: any, cache?: boolean): any;
    /**
     *
     * @param {string} query
     * @param {Object} variables
     * @param {boolean} cache
     */
    query(query: string, variables: any, cache?: boolean): any;
};
export let client: any;
