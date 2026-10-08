import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => string;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  rememberMe: boolean;
  alias: string;
  password: string;
  originalUrl: string | undefined;
}

export class LoginPresenter {
  view: LoginView;
  userService: UserService;

  constructor(view: LoginView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doLogin() {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(
        this.view.alias,
        this.view.password,
      );

      this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);

      if (!!this.view.originalUrl) {
        this.view.navigate(this.view.originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
