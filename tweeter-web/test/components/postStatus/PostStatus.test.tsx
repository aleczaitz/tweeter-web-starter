import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { anything, instance, verify } from "@typestrong/ts-mockito";
import { mock } from "@typestrong/ts-mockito";
import { PostPresenter } from "../../../src/presenter/PostPresenter";
import { User } from "tweeter-shared/dist/model/domain/User";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";

jest.mock("../../../src/components/userInfo/UserHooks", () => ({
  useUserInfo: jest.fn(() => ({
    currentUser: new User("firstName", "lastName", "alias", "imageUrl"),
    authToken: new AuthToken("token", 12345),
  })),
}));

describe("PostStatus component", () => {
  it("starts with the Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text.", async () => {
    const { postStatusButton, clearStatusButton, postStatusTextArea, user } =
      renderPostStatusAndGetElement();

    await user.type(postStatusTextArea, "a");
    
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { postStatusButton, clearStatusButton, postStatusTextArea, user } =
      renderPostStatusAndGetElement();

    await user.type(postStatusTextArea, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const post = "postString";

    const { postStatusButton, postStatusTextArea, user } =
      renderPostStatusAndGetElement(mockPresenterInstance);
      
    await user.type(postStatusTextArea, post);
    await user.click(postStatusButton);

    verify(mockPresenter.submitPost(post, anything(), anything())).once();
  });
});

function renderPostStatus(presenter?: PostPresenter) {
  return render(
    <MemoryRouter>
      <PostStatus presenter={presenter} />
    </MemoryRouter>,
  );
}

function renderPostStatusAndGetElement(
    presenter?: PostPresenter,
) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("post status");
  const clearStatusButton = screen.getByLabelText("clear status");
  const postStatusTextArea = screen.getByLabelText("post status input");

  return { postStatusButton, clearStatusButton, postStatusTextArea, user };
}
