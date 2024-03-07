import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userpool from "./userpool";
import { calculateSecretHash } from "crypto";

export const authenticate = (Email, Password) => {
  const secretHash = crypto
    .createHmac("SHA256", 'dbv7i08h3m7q0lduk1jrgoqhus273gan5qtqag673nl0aaoc3va')
    .update(Email + userpool.getClientId())
    .digest("base64");
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: Email,
      Pool: userpool,
    });

    const authDetails = new AuthenticationDetails({
      Username: Email,
      Password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("login successful");
        resolve(result);
      },
      onFailure: (err) => {
        console.log("login failed", err);
        reject(err);
      },
    });
  });
};

export const logout = () => {
  const user = userpool.getCurrentUser();
  user.signOut();
  window.location.href = "/";
};
