import { AuthToken, User, FakeData, Follow } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
    setIsFollower: (isFollower: boolean) => void;
    displayErrorMessage: (message: string) => string;
    displayInfoMessage: (
    message: string,
    duration: number,
  ) => string;
    deleteMessage: (messageId: string) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    setDisplayedUser: (user: User) => void;
    navigate: (url: string) => void;
    displayedUser: User | null;
    currentUser: User | null;
    authToken: AuthToken | null;
}

export class UserInfoPresenter {
  view: UserInfoView;
  followService: FollowService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.followService = new FollowService;
  }

  // p
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!),
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      );
    }
  };

  // p
  public async setNumbFollowees(authToken: AuthToken, displayedUser: User){
    try {
      this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`,
      );
    }
  };

  // p
  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
  };

  // p
  public async followDisplayedUser(): Promise<void> {
    var followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${this.view.displayedUser!.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.followService.follow(
        this.view.authToken!,
        this.view.displayedUser!,
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  };

  // p
  public async unfollowDisplayedUser(): Promise<void> {

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
  };

  public switchToLoggedInUser(): void {
    this.view.setDisplayedUser(this.view.currentUser!);
    this.view.navigate(`${this.getBaseUrl()}/${this.view.currentUser!.alias}`);
  };

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };
}
