import Workspace from "components/layouts/Workspace";
import { NOTIFICATION } from "styles";

const Hometasks = () => {
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>Hometasks for today</h1>
      </div>
    </Workspace>
  );
};

export default Hometasks;
