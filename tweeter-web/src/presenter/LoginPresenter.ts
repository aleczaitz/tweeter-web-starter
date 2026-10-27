import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { AuthenticationView, Presenter } from "./Presenter";

export interface LoginView extends AuthenticationView {
  originalUrl: string | undefined;
}

export class LoginPresenter extends Presenter<LoginView> {
  userService = new UserService();

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    this.doAuthenticationOperation(
      (): Promise<[User, AuthToken]> => {
        return this.userService.login(alias, password);
      },
      "log user in",
      this.view,
      rememberMe
    );
  }
}
