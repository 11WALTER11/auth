import { Amplify } from "aws-amplify";

import { Authenticator } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, signOut, getCurrentUser } from "aws-amplify/auth";

import "@aws-amplify/ui-react/styles.css";

// https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/
Amplify.configure({
  Auth: {
    // Auth: {
    //   region: "us-west-2",
    //   userPoolId: "us-west-2_SWWZgdrAq",
    //   userPoolWebClientId: "1dhri7u2m7l2tqqs4mda0inh8e",
    // },
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: "us-west-2_SWWZgdrAq",
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: "1dhri7u2m7l2tqqs4mda0inh8e",
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: "us-west-2:fac9a06f-8c95-47d4-999f-48487be78fc8	",
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: "code", // 'code' | 'link'
      loginWith: {
        // OPTIONAL - Hosted UI configuration
        oauth: {
          domain: "https://login.bridge2ps.app",
          scopes: [
            "phone",
            "email",
            "profile",
            "openid",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: ["http://localhost:3000"],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has occurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
    }
  };

  return (
    <>
      <div className="App">
        <button
          onClick={() => signInWithRedirect({ customState: "shopping-cart" })}
        >
          Open Hosted UI
        </button>
        <button
          onClick={() =>
            signInWithRedirect({
              provider: "Facebook",
              customState: "shopping-cart",
            })
          }
        >
          Open Facebook
        </button>
        <button
          onClick={() =>
            signInWithRedirect({
              provider: "Google",
              customState: "shopping-cart",
            })
          }
        >
          Open Google
        </button>
        <button
          onClick={() =>
            signInWithRedirect({
              provider: "Amazon",
              customState: "shopping-cart",
            })
          }
        >
          Open Amazon
        </button>
        <button
          onClick={() =>
            signInWithRedirect({
              provider: "Apple",
              customState: "shopping-cart",
            })
          }
        >
          Open Apple
        </button>
        <button onClick={() => signOut()}>Sign Out</button>
        <div>{user?.username}</div>
        <div>{customState}</div>
      </div>
      <Authenticator socialProviders={["google"]} initialState="signIn">
        {({ signOut }) => <button onClick={signOut}>Sign out</button>}
      </Authenticator>
    </>
  );
}

export default App;
