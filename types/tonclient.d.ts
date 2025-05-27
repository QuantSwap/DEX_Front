declare module '@tonclient/core' {
  export class TonClient {
    constructor(config: any);
    static useBinaryLibrary(lib: any): void;
    net: {
      query_collection(params: any): Promise<any>;
    };
    close(): void;
  }
}

declare module '@tonclient/lib-web' {
  export const libWeb: any;
}
