import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserItemPresenter } from "./UserItemPresenter";
import { User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected itemDescription(): string {
    return "load Followees";
  }
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
    );
  }
}
