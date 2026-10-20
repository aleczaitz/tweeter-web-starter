import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (url: string) => void;
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

export class LoginPresenter extends Presenter<LoginView> {
  userService: UserService;

  constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public async doLogin() {
    try {
      this.doFailureReportingOperation(async () => {
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
      }, "log user in");
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
