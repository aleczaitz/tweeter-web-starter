import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

interface UserNavigation {
  navigateToUser: (
    event: React.MouseEvent,
    featureUrl: string,
  ) => Promise<void>;
  extractAlias: (value: string) => string;
}

export const useUserNavigation = (featureUrl: string): UserNavigation => {
  const { displayErrorMessage } = useMessageActions();

  const navigate = useNavigate();

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const listener: UserNavigationView = {
    navigate,
    setDisplayedUser,
    displayErrorMessage,
    authToken,
    displayedUser,
    featureUrl,
  };

  const presenter = new UserNavigationPresenter(listener);

  return {
    navigateToUser: presenter.navigateToUser,
    extractAlias: presenter.extractAlias,
  };
};
