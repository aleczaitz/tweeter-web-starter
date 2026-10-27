import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavBarView extends MessageView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class AppNavBarPresenter extends Presenter<AppNavBarView> {
  _userService = new UserService();

  public get userService(): UserService {
    return this._userService;
  }

  public async logOut(authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
  }
}
