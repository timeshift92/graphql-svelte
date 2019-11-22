import { SubscriptionClient } from "graphql-subscriptions-client";
export function SubscribeQL(url, options) {
    return client = new SubscriptionClient(url, options);
}