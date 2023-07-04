import { useEffect, useState } from "react";
import IconPopup from "./components/IconPopup";
import Result from "./components/Result";
import { enableSelectionEndEvent, SelectionEndEventDetail } from "./selection";

let currAnchorNode: Node | null = null;

function App() {
  const [open, setOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [selection, setSelection] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });

  function handleSelectionEnd({
    detail: { text, postion, anchorNode },
  }: {
    detail: SelectionEndEventDetail;
  }) {
    setSelection(text);
    setPosition({
      top: postion.y,
      left: postion.x,
    });
    setOpen(true);
    currAnchorNode = anchorNode;
  }

  useEffect(() => {
    enableSelectionEndEvent();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.addEventListener("selectionend", handleSelectionEnd);
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.removeEventListener("selectionend", handleSelectionEnd);
    };
  });

  function handleClose() {
    setOpen(false);
    setShowIcon(true);
  }

  function handleCopy(content: string) {
    navigator.clipboard.writeText(content);
    handleClose();
  }

  function handleInsert(content: string) {
    // TODO: This is a hack to make sure the content is inserted after the
    // current selection. We should find a better way to do this.
    setTimeout(() => {
      if (currAnchorNode) {
        currAnchorNode.textContent =
          currAnchorNode.textContent + "\n" + content;
      }
    }, 300);
    handleClose();
  }

  // When selection ends, we show the icon popup.
  if (!open) {
    return null;
  }
  if (showIcon) {
    return (
      <IconPopup
        open={open}
        position={position}
        onClose={handleClose}
        onClick={() => setShowIcon(false)}
      />
    );
  }
  // When the icon is clicked, we show the result popup.
  return (
    <Result
      isOpen={open}
      selection={selection}
      onClose={handleClose}
      onCopy={handleCopy}
      onInsert={handleInsert}
    />
  );
}

export default App;
