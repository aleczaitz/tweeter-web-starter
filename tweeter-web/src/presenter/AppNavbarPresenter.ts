import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavBarView extends MessageView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
  authToken: AuthToken | null;
}

export class AppNavBarPresenter extends Presenter<AppNavBarView> {
  userService: UserService;

  public constructor(view: AppNavBarView) {
    super(view);
    this.userService = new UserService();
  }

  public async logOut() {
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(this.view.authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
  }
}
