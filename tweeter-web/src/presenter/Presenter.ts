import { AuthToken, User } from "tweeter-shared";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}

export interface AuthenticationView extends View {
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
}

export abstract class Presenter<V extends View> {
  _view: V;

  public constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`,
      );
    }
  }

  protected async doAuthenticationOperation<T extends AuthenticationView>(
    operation: () => Promise<[User, AuthToken]>,
    operationDescription: string,
    authView: T,
  ) {
    try {
      this.doFailureReportingOperation(async () => {
        authView.setIsLoading(true);

        const [user, authToken] = await operation();

        authView.updateUserInfo(user, user, authToken, authView.rememberMe);

        if (
          "originalUrl" in authView &&
          typeof authView.originalUrl === "string" &&
          authView.originalUrl
        ) {
          authView.navigate(authView.originalUrl);
        } else {
          authView.navigate(`/feed/${user.alias}`);
        }
      }, operationDescription);
    } finally {
      authView.setIsLoading(false);
    }
  }
}
