import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (imageFileExtension: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => string;
  navigate: (url: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  rememberMe: boolean;
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
}

export class RegisterPresenter {
  view: RegisterView;
  userService: UserService;

  constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  public async doRegister() {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        this.view.firstName,
        this.view.lastName,
        this.view.alias,
        this.view.password,
        this.view.imageBytes,
        this.view.imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
}
