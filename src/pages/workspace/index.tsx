import Workspace from "components/layouts/Workspace";
import { NOTIFICATION } from "styles";

const Notes = () => {
  return (
    <Workspace>
      <h1 className={NOTIFICATION}>
        Here are your notes sorted by topics and dates created.
      </h1>
    </Workspace>
  );
};

export default Notes;
