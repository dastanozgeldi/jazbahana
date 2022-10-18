import Workspace from "components/layouts/Workspace";
import { NOTIFICATION } from "styles";

const Notes = () => {
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          Here are your notes sorted by topics and dates created.
        </h1>
      </div>
    </Workspace>
  );
};

export default Notes;
