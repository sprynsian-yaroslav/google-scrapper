import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_CLOSE_AFTER = 3000;

export const DEFAULT_TOAST_OPTIONS = {
  autoClose: TOAST_CLOSE_AFTER,
  hideProgressBar: true,
  position: toast.POSITION.TOP_RIGHT,
  pauseOnHover: false,
};

class ToasterService {

  success(message) {
    toast.success(message, DEFAULT_TOAST_OPTIONS)
  }

  error(message, options = DEFAULT_TOAST_OPTIONS) {
    toast.error(message, options)
  }

  static $displayName = "ToasterService"
}

export const ToastElement = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={TOAST_CLOSE_AFTER}
      hideProgressBar
      theme="colored"
    />
  )
}

export default ToasterService
