import { SubscriptionClient } from "graphql-subscriptions-client";
export function SubscribeQL(url, options) {
    return  new SubscriptionClient(url, options);
}