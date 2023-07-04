import { DownOutlined } from "@ant-design/icons";
import { CopyIcon, InsertIcon } from "../icons";
import {
  Button,
  Divider,
  Dropdown,
  MenuProps,
  Modal,
  Spin,
  Tooltip,
} from "antd";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Rpc from "../rpc/index.js";

type Service = {
  name: string;
  description: string;
};

export default function Result({
  selection,
  isOpen,
  onClose,
  onCopy,
  onInsert,
}: {
  selection: string;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (content: string) => void;
  onInsert: (content: string) => void;
}) {
  // The content of AI assistant answer
  const [content, setContent] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [currService, setCurrService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  function handleServiceChange(service: Service) {
    setCurrService(service);
    console.log("handleServiceChange", service.description, selection);
    Rpc.serve(service.name, selection)
      .then((response) => {
        // TODO: check status
        setContent(response.result);
      })
      .catch((err) => {
        setContent("Failed to get response");
        console.log(err);
      });
  }

  function getServiceList() {
    // TODO: get the service list from the local storage, but the service list may change
    const localJSONServices = window.localStorage.getItem("services");
    if (localJSONServices) {
      // TODO: memorize the last service used
      const localServices: Service[] = JSON.parse(localJSONServices);
      handleServiceChange(localServices[0]);
      setServices(localServices);
      return;
    }
    Rpc.getServiceList()
      .then((services) => {
        setServices(services);
        handleServiceChange(services[0]);
        window.localStorage.setItem("services", JSON.stringify(services));
      })
      .catch((err) => {
        setContent("Failed to get service list");
        console.log(err);
      });
    return services;
  }

  useEffect(() => {
    console.log("get service list");
    getServiceList();
  }, []);

  // Show the result of the AI assistant or a loading
  const modalInner =
    content !== "" ? (
      content
    ) : (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        <Title
          currService={currService}
          disabled={disabled}
          services={services}
          setDisabled={setDisabled}
          onServiceChange={handleServiceChange}
        />
      }
      footer={
        <Footer
          onCopy={() => onCopy(content)}
          onInsert={() => onInsert(content)}
        />
      }
      modalRender={(modal) => (
        <WrapperDraggdale modal={modal} disabled={disabled} />
      )}
    >
      {modalInner}
    </Modal>
  );
}

function Title({
  disabled,
  services,
  currService,
  setDisabled,
  onServiceChange,
}: {
  disabled: boolean;
  currService: Service | null;
  services: Service[];
  setDisabled: (disabled: boolean) => void;
  onServiceChange: (service: { name: string; description: string }) => void;
}) {
  const items: MenuProps["items"] = services.map((service) => ({
    label: (
      <div
        onClick={() => {
          // setSelection(service.name);
          onServiceChange(service);
        }}
      >
        {service.description}
      </div>
    ),
    key: service.name,
  }));
  return (
    <div
      onMouseOver={() => disabled && setDisabled(false)}
      onMouseOut={() => setDisabled(true)}
      style={{
        width: "100%",
        cursor: "move",
        userSelect: "none",
      }}
    >
      <Dropdown.Button icon={<DownOutlined />} menu={{ items }} type="text">
        {currService ? currService.description : "Loading..."}
      </Dropdown.Button>
      <Divider />
    </div>
  );
}

function Footer({
  onCopy,
  onInsert,
}: {
  onCopy: () => void;
  onInsert: () => void;
}) {
  return (
    <div>
      <Tooltip title="Copy">
        <Button
          type="text"
          icon={<CopyIcon />}
          shape="circle"
          onClick={onCopy}
        ></Button>
      </Tooltip>
      <Tooltip title="Insert">
        <Button
          type="text"
          icon={<InsertIcon />}
          shape="circle"
          onClick={onInsert}
        ></Button>
      </Tooltip>
    </div>
  );
}

function WrapperDraggdale({
  modal,
  disabled,
}: {
  modal: React.ReactNode;
  disabled: boolean;
}) {
  const draggleRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  return (
    <Draggable
      bounds={bounds}
      onStart={(_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
          return;
        }
        setBounds({
          left: uiData.x - targetRect.left,
          top: uiData.y - targetRect.top,
          right: clientWidth - (targetRect.right - uiData.x),
          bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
      }}
      disabled={disabled}
    >
      <div ref={draggleRef}>{modal}</div>
    </Draggable>
  );
}
