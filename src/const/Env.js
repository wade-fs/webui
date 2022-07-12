export const Dev = process.env.NODE_ENV != "production";
export const apiUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:8088";
export const ApiDelay = Dev ? 1000 : 0;
export const BuildInfo = VISTA_Q8_VERSION;
export const ApiEndpoint = API_ENDPOINT;
export const WsEndpoint = WS_ENDPOINT.match(/wss?\:\/\//)
  ? WS_ENDPOINT
  : `ws${window.location.protocol == "https:" ? "s" : ""}://${
      window.location.host
    }${WS_ENDPOINT}`;
export const Timeout = 60000;

// default config
export const DefaultSession = 120;
export const DefaultIdle = 30;
