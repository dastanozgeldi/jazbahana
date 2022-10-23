import Workspace from "components/layouts/Workspace";
import { NOTIFICATION } from "styles";

const Index = () => {
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          This is your workspace, feel free to create and explore!
        </h1>
      </div>
    </Workspace>
  );
};

export default Index;
