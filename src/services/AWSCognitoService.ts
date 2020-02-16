import AWS from 'aws-sdk';

const {
  AWS_API_VERSION,
  AWS_COGNITO_REGION,
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_USER_POOL_ID,
} = process.env;

class AWSCognitoService {
  protected client: AWS.CognitoIdentityServiceProvider;
  protected clientId: string;
  protected userPoolId: string;

  constructor() {
    this.client = new AWS.CognitoIdentityServiceProvider({
      apiVersion: AWS_API_VERSION || '2016-04-18',
      region: AWS_COGNITO_REGION || 'us-east-1',
    });

    if (!AWS_COGNITO_USER_POOL_ID || !AWS_COGNITO_CLIENT_ID) {
      throw new Error('Invalid configuration cognito.');
    }

    this.clientId = AWS_COGNITO_CLIENT_ID;
    this.userPoolId = AWS_COGNITO_USER_POOL_ID;
  }

  async getUser(
    email: string
  ): Promise<AWS.CognitoIdentityServiceProvider.Types.AdminGetUserResponse> {
    return this.client
      .adminGetUser({
        UserPoolId: this.userPoolId,
        Username: email,
      })
      .promise();
  }

  async getUserByToken(
    accessToken: AWS.CognitoIdentityServiceProvider.TokenModelType
  ): Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse> {
    return this.client
      .getUser({
        AccessToken: accessToken,
      })
      .promise();
  }

  listUsers(
    limit?: number,
    filters?: { name: string; value: string; contains?: boolean }[],
    attributes?: AWS.CognitoIdentityServiceProvider.Types.SearchedAttributeNamesListType
  ): Promise<AWS.CognitoIdentityServiceProvider.Types.ListUsersResponse> {
    return this.client
      .listUsers({
        UserPoolId: this.userPoolId,
        Limit: limit || 60,
        AttributesToGet: attributes,
        Filter: (filters ?? [])
          .map(
            ({ name, value, contains }) =>
              `${name}${contains ? '^' : ''}="${value}"`
          )
          .join(','),
      })
      .promise();
  }

  async createUser(
    email: string,
    password: string,
    userId: string | number
  ): Promise<AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserResponse> {
    return this.client
      .adminCreateUser({
        UserPoolId: this.userPoolId,
        Username: email,
        TemporaryPassword: password,
        MessageAction: 'SUPPRESS',
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
          {
            Name: 'custom:thp_customer_id',
            Value: String(userId),
          },
        ],
      })
      .promise();
  }

  async initiateAuth(
    email: string,
    password: string
  ): Promise<
    AWS.CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse
  > {
    const initiateAuth = await this.client
      .adminInitiateAuth({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
      .promise();

    const { ChallengeName, Session } = initiateAuth;

    if (ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      return this.respondToAuthChallenge(email, password, Session);
    }

    return initiateAuth;
  }

  async respondToAuthChallenge(
    email: string,
    password: string,
    session?: AWS.CognitoIdentityServiceProvider.SessionType
  ): Promise<
    AWS.CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse
  > {
    return this.client
      .adminRespondToAuthChallenge({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: password,
        },
        Session: session,
      })
      .promise();
  }

  async createUserOrLogin(
    email: string,
    password: string,
    userId: string | number
  ): Promise<
    AWS.CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse
  > {
    await this.createUser(email, password, userId);
    const initiateAuth = await this.initiateAuth(email, password);

    return this.respondToAuthChallenge(email, password, initiateAuth.Session);
  }

  async deleteUser(
    email: string
  ): Promise<{ $response: AWS.Response<{}, AWS.AWSError> }> {
    return this.client
      .adminDeleteUser({
        UserPoolId: this.userPoolId,
        Username: email,
      })
      .promise();
  }

  async signOut(
    email: AWS.CognitoIdentityServiceProvider.UsernameType
  ): Promise<
    AWS.CognitoIdentityServiceProvider.AdminUserGlobalSignOutResponse
  > {
    return this.client
      .adminUserGlobalSignOut({
        UserPoolId: this.userPoolId,
        Username: email,
      })
      .promise();
  }

  async globalSignOut(
    accessToken: AWS.CognitoIdentityServiceProvider.TokenModelType
  ): Promise<AWS.CognitoIdentityServiceProvider.GlobalSignOutResponse> {
    return this.client
      .globalSignOut({
        AccessToken: accessToken,
      })
      .promise();
  }
}

export default new AWSCognitoService();
