import { AuthToken, Status, User } from "tweeter-shared";

export interface PostView {
  setIsLoading(isLoading: boolean): void;
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => string;
  deleteMessage: (messageId: string) => void;
  setPost(post: string): void;
}

export class PostPresenter {
  private view: PostView;

  public constructor(view: PostView) {
    this.view = view;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken,
  ) {
    var postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }

  private async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
