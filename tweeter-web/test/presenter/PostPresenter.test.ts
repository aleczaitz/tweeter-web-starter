import {
  anything,
  capture,
  instance,
  mock,
  spy,
  when,
} from "@typestrong/ts-mockito";
import { PostPresenter, PostView } from "../../src/presenter/PostPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import { verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

describe("PostPresenter", () => {
  let mockPostPresenterView: PostView;
  let postPresenter: PostPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const post = "post123";
  const user = new User("firstname", "lastname", "alias", "imageURL");

  beforeEach(() => {
    mockPostPresenterView = mock<PostView>();
    const mockPostPresenterViewInstance = instance(mockPostPresenterView);
    when(mockPostPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123",
    );

    const postPresenterSpy = spy(
      new PostPresenter(mockPostPresenterViewInstance),
    );
    postPresenter = instance(postPresenterSpy);

    mockStatusService = mock<StatusService>();
    when(postPresenterSpy.statusService).thenReturn(
      instance(mockStatusService),
    );
  });

  it("tells the view to display a posting status message.", async () => {
    await postPresenter.submitPost(post, user, authToken);
    verify(
      mockPostPresenterView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
    await postPresenter.submitPost(post, user, authToken);

    let [passedToken, passedStatus] = capture(
      mockStatusService.postStatus,
    ).first();
    expect(passedToken).toBe(authToken);
    expect(passedStatus.user).toBe(user);
    expect(passedStatus.post).toBe(post);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when posting of the status is successful", async () => {
    await postPresenter.submitPost(post, user, authToken);
    verify(mockPostPresenterView.deleteMessage("messageId123")).once();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when posting of the status is not successful", async () => {
    let error = new Error("an error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postPresenter.submitPost(post, user, authToken);

    verify(mockPostPresenterView.deleteMessage("messageId123")).once();
    verify(mockPostPresenterView.setPost("")).never();
    verify(
      mockPostPresenterView.displayInfoMessage(anything(), anything()),
    ).once();
  });
});
