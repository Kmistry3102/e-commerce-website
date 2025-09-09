import { Bounce, toast, ToastOptions } from "react-toastify";

type ToastType = "info" | "success" | "warning" | "error" | "default";

interface ToastProps {
  type?: ToastType;
  message: string;
}

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const showToast = ({ type = "default", message }: ToastProps): void => {
  switch (type) {
    case "info":
      toast.info(message, baseOptions);
      break;
    case "success":
      toast.success(message, baseOptions);
      break;
    case "warning":
      toast.warning(message, baseOptions);
      break;
    case "error":
      toast.error(message, baseOptions);
      break;
    default:
      toast(message, baseOptions);
  }
};
