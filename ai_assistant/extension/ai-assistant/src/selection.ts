let lastSelection: string | null = null;

/**
 * Enable selection end event.
 *
 * The event is triggered when the user finishes selecting text.
 */
export function enableSelectionEndEvent() {
  document.addEventListener("mouseup", triggerSelectionEndEvent);
}

export type SelectionEndEventDetail = {
  text: string;
  postion: { x: number; y: number };
  anchorNode: Node | null;
};

function triggerSelectionEndEvent() {
  const selection = document.getSelection();
  if (
    selection == null ||
    selection.isCollapsed ||
    selection.rangeCount === 0
  ) {
    return;
  }
  const text = selection.toString();
  // Prevent duplicate events.
  if (text == lastSelection || text.length === 0) {
    return;
  }
  lastSelection = text;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const detail: SelectionEndEventDetail = {
    text,
    postion: { x: rect.right, y: rect.bottom },
    anchorNode: selection.anchorNode,
  };
  const customEvent = new CustomEvent("selectionend", { detail });
  document.dispatchEvent(customEvent);
}
