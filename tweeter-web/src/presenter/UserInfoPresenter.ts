import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
  displayedUser: User | null;
  currentUser: User | null;
  authToken: AuthToken | null;
  isFollower: boolean;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  followService: FollowService = new FollowService();

  // p
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  // p
  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get folowees count");
  }

  // p
  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {}, "get followers count");
    this.view.setFollowerCount(
      await this.followService.getFollowerCount(authToken, displayedUser),
    );
  }

  private async doChangeFollowingForDisplayedUserOperation(
    operation: () => Promise<[number, number]>,
    operationDescription: string,
  ): Promise<void> {
    var followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `${operationDescription.charAt(0).toUpperCase() + operationDescription.slice(1)}ing ${this.view.displayedUser!.name}...`, // String
        0,
      );

      const [followerCount, followeeCount] = await operation();

      this.view.setIsFollower(!this.view.isFollower); // boolean difference, maybe negate whatever exists
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} user because of exception: ${error}`, // string difference
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }

  // p
  public async followDisplayedUser(): Promise<void> {
    this.doChangeFollowingForDisplayedUserOperation(() => {
      return this.followService.follow(
        this.view.authToken!,
        this.view.displayedUser!,
      );
    }, "follow");
  }

  // p
  public async unfollowDisplayedUser(): Promise<void> {
    this.doChangeFollowingForDisplayedUserOperation(() => {
      return this.followService.unfollow(
        this.view.authToken!,
        this.view.displayedUser!,
      )
    }, "unfollow");


    
    var unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${this.view.displayedUser!.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.followService.unfollow(
        this.view.authToken!,
        this.view.displayedUser!,
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  }

  public switchToLoggedInUser(): void {
    this.view.setDisplayedUser(this.view.currentUser!);
    this.view.navigate(`${this.getBaseUrl()}/${this.view.currentUser!.alias}`);
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }
}
