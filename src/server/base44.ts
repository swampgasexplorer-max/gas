/**
 * Base44 SDK client — Swamp Gas Explorer backend.
 * Server-only: never import this in client code.
 */
import { createClient } from "@base44/sdk";

export const base44 = createClient({
  appId: "6a60bdc3aff2c7a607784f5f",
  headers: {
    api_key: "b61132cb01924a648977a431bc706f75",
  },
});
