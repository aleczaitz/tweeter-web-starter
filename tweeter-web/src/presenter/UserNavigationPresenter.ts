import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  navigate: (url: string) => void;
  setDisplayedUser: (user: User) => void;
  authToken: AuthToken | null;
  displayedUser: User | null;
  featureUrl: string;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  userService = new UserService();

  navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const toUser = await this.userService.getUser(
        this.view.authToken!,
        alias,
      );

      if (toUser) {
        if (!toUser.equals(this.view.displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${this.view.featureUrl}/${toUser.alias}`);
        }
      }
    }, "get user"); 
  };

  extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
