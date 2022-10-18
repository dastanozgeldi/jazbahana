import Workspace from "components/layouts/Workspace";
import { NOTIFICATION } from "styles";

const Connections = () => {
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          Here are people you are connected with.
        </h1>
      </div>
    </Workspace>
  );
};

export default Connections;
