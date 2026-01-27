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
    <div className={`fixed top-3 right-3 sm:top-4 sm:right-4 z-40`}>
      <div
        className={`relative rounded-md p-2 sm:p-3 pl-3 sm:pl-4 pr-3 sm:pr-4 ${openModalMessage.type === "success" ? "bg-green-300" : "bg-red-300"} flex flex-col gap-2 shadow-md`}
        onMouseEnter={() => setShowButtonClose(true)}
        onMouseLeave={() => setShowButtonClose(false)}
      >
        {showButtonClose && (
          <button
            className="absolute top-1 right-1 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={() => setOpenModalMessage(CURRENT_MODAL_MESSAGE)}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
        <h2 className="text-xs sm:text-sm font-bold">
          {openModalMessage.type === "error" ? "ERROR" : "SUCCESS"}
        </h2>
        {openModalMessage.message && (
          <p className="text-xs sm:text-sm">{openModalMessage.message}</p>
        )}
      </div>
    </div>
  );
}
