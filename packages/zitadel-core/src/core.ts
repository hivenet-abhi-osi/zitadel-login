/**
 * Return a slugified copy of a string.
 *
 * @param {CoreProps} str The ZITADEL client configuration
 * @return {Core} The client implementation.
 */

export interface ZitadelCoreProps {
  clientId: string;
}

export interface ZitadelApp {
  config: ZitadelCoreProps;
}

export async function initializeApp(
  config: ZitadelCoreProps
): Promise<ZitadelApp> {
  const app = { config };
  return app;
}
