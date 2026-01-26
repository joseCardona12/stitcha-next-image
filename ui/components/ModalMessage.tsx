import { CURRENT_MODAL_MESSAGE, IModalMessage } from "@/app/page";
import { X } from "lucide-react";
import { useState } from "react";

interface IModalMessageProps {
  setOpenModalMessage: (value: IModalMessage) => void;
  openModalMessage: IModalMessage;
}
export default function ModalMessage({
  setOpenModalMessage,
  openModalMessage,
}: IModalMessageProps) {
  const [showButtonClose, setShowButtonClose] = useState<boolean>(false);
  return (
    <div className={`absolute top-2 right-2`}>
      <div
        className={`relative rounded-md p-2 pl-4 pr-4 ${openModalMessage.type === "success" ? "bg-green-50" : "bg-red-300"} flex flex-col gap-2 shadow-sm`}
        onMouseEnter={() => setShowButtonClose(true)}
        onMouseLeave={() => setShowButtonClose(false)}
      >
        {showButtonClose && (
          <button
            className="absolute top-0 right-0 bg-gray-200 rounded-md cursor-pointer"
            onClick={() => setOpenModalMessage(CURRENT_MODAL_MESSAGE)}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <h2>{openModalMessage.type === "error" ? "ERROR" : "SUCCESS"}</h2>
        {openModalMessage.message && <p>{openModalMessage.message}</p>}
      </div>
    </div>
  );
}
