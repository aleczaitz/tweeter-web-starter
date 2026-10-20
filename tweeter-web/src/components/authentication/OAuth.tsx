import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface Props {
  displayInfoMessage: (message: string) => void;
}

const providers: [IconName, string][] = [
  ["google", "Google"],
  ["facebook", "Facebook"],
  ["twitter", "Twitter"],
  ["linkedin", "LinkedIn"],
  ["github", "Github"],
];

const OAuth = (props: Props) => {
  return (
    // TODO: remove duplicate buttons
    <div className="text-center mb-3">
      {providers.map((provider, index) => (
        <button
          key={index}
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            props.displayInfoMessage(
              `${provider[1]} registration is not implemented.`,
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`${provider[0]}`}>{provider[1]}</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", provider[0]]} />
          </OverlayTrigger>
        </button>
      ))}
    </div>
  );
};

export default OAuth;
