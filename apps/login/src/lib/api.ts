import { importPKCS8, SignJWT } from "jose";
import { getInstanceByHost } from "./zitadel";

export async function getInstanceUrl(host: string): Promise<string> {
  const [hostname, port] = host.split(":");

  // if (hostname === "localhost") {
  //   console.log("fallback to ZITADEL_API_URL");
  //   return process.env.ZITADEL_API_URL || "";
  // }

  const instance = await getInstanceByHost(host).catch((error) => {
    console.error(`Could not get instance by host ${host}`, error);
    return null;
  });

  if (!instance) {
    throw new Error("No instance found");
  }

  const generatedDomain = instance.domains.find(
    (domain) => domain.generated === true,
  );

  if (!generatedDomain?.domain) {
    throw new Error("No generated domain found");
  }

  console.log(`host: ${host}, api: ${generatedDomain?.domain}`);

  return generatedDomain?.domain;
}

export async function systemAPIToken() {
  const audience = process.env.AUDIENCE;
  const userID = process.env.SYSTEM_USER_ID;
  const key = process.env.SYSTEM_USER_PRIVATE_KEY;

  const decodedToken = Buffer.from(key, "base64").toString("utf-8");

  const token = new SignJWT({})
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .setIssuer(userID)
    .setSubject(userID)
    .setAudience(audience)
    .sign(await importPKCS8(decodedToken, "RS256"));

  return token;
}
