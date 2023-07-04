import "./IconPopup.css";

export default function IconPopup({
  open,
  position,
  onClose,
  onClick,
}: {
  open: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onClick: () => void;
}) {
  if (!open) {
    return null;
  }
  const modalStyle = {
    top: position.top,
    left: position.left,
  };

  function handleMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={modalStyle} onMouseUp={handleMouseUp}>
        <div className="modal-content">
          <Icon onClick={onClick}></Icon>
        </div>
      </div>
    </>
  );
}

function Icon({ onClick }: { onClick: () => void }) {
  return (
    <div className="icon" onClick={onClick}>
      🗿
    </div>
  );
}
