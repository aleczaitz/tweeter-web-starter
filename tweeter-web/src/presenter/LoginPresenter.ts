import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { AuthenticationView, Presenter } from "./Presenter";

export interface LoginView extends AuthenticationView {
  originalUrl: string | undefined;
}

export class LoginPresenter extends Presenter<LoginView> {
  userService = new UserService();

  public async doLogin() {
    this.doAuthenticationOperation(
      (): Promise<[User, AuthToken]> => {
        return this.userService.login(this.view.alias, this.view.password);
      },
      "log user in",
      this.view,
    );
  }
}
