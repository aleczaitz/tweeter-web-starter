import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  navigate: (url: string) => void;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => string;
  authToken: AuthToken | null;
  displayedUser: User | null;
  featureUrl: string;
}

export class UserNavigationPresenter {
  view: UserNavigationView;
  userService: UserService;

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.userService = new UserService();
  }

  navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
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
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  };

  extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
