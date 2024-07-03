import KJUR from "jsrsasign";

const SDK_KEY = "your-sdk-key";
const SDK_SECRET = "your-skd-secret";

// To generate sdk_key and sdk_secret -
// 1. Visit - https://zoom.us/pricing/developer
// 2. Select Video SDK Pay As You Go plan
// 3. Enter details and create account
// 4. Click on Build App
// 5. Enter the name of the App, and you will get sdk_key and sdk_secret below

export function generateSignature(sessionName, role) {

    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // 2 Hours of expiration time
    const oHeader = {alg: "HS256", typ: "JWT"};

    const oPayload = {
        app_key: SDK_KEY,
        tpc: sessionName,
        role_type: role,
        version: 1,
        iat: iat,
        exp: exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    return KJUR.KJUR.jws.JWS.sign("HS256", sHeader, sPayload, SDK_SECRET);
}
