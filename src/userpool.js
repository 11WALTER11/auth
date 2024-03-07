import { CognitoUserPool } from 'amazon-cognito-identity-js';
const poolData = {
  UserPoolId: 'us-west-2_SWWZgdrAq',
  ClientId: '1dhri7u2m7l2tqqs4mda0inh8e',
};
export default new CognitoUserPool(poolData);