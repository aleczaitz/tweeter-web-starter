import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserItemPresenter } from "./UserItemPresenter";
import { User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected itemDescription(): string {
    return "load followers";
  }
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
    );
  }
}
