import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
