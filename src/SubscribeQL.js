import { SubscriptionClient } from "graphql-subscriptions-client";
export function init(url, options) {
    return client = new SubscriptionClient(url, options);
}