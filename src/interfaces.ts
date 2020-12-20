export interface queryType {
  query: string;
  variables?: object;
  cache?: boolean;
  key?: (key: any) => any;
};
