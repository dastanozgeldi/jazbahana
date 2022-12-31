import { UploadNote } from "components/common/UploadNote";
import { useState, useEffect } from "react";

const NewNote = () => {
  const [Comp, setComp] = useState<any>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => {
      setComp(comp.Excalidraw as any);
    });
    setWidth(window.innerWidth * 0.85);
    setHeight(window.innerHeight * 0.85);
  }, []);

  return (
    <div className="flex items-start gap-3">
      <div style={{ width, height }}>{Comp && <Comp />}</div>
      <UploadNote />
    </div>
  );
};

export default NewNote;
