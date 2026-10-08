import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AppNavBarView {
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => string;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigate: (path: string) => void;
  authToken: AuthToken | null;
}

export class AppNavBarPresenter {
  view: AppNavBarView;
  userService: UserService;

  public constructor(view: AppNavBarView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async logOut() {
    
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(this.view.authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
