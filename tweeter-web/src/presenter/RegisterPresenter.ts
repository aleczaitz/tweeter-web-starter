import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { AuthenticationView, Presenter } from "./Presenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (imageFileExtension: string) => void;
  firstName: string;
  lastName: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  userService: UserService = new UserService();

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
    this.doAuthenticationOperation(
      async (): Promise<[User, AuthToken]> => {
        return this.userService.register(
          this.view.firstName,
          this.view.lastName,
          this.view.alias,
          this.view.password,
          this.view.imageBytes,
          this.view.imageFileExtension,
        );
      },
      "register user",
      this.view,
    );
  }

  getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
}
