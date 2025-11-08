import { useRef, forwardRef, useImperativeHandle } from "react";
import NewBook from "./NewBook";

function ModalComponent({ children }, ref) {
  const modalRef = useRef();

  // expose imperative methods to parent via ref
  useImperativeHandle(ref, () => ({
    show: () => modalRef.current?.showModal(),
    close: () => modalRef.current?.close(),
  }));

  function openModal() {
    modalRef.current?.showModal();
  }

  // prevent closing when ESC key is pressed
  function preventClose(event) {
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
    }
  }

  return (
    <>
      <NewBook onClick={openModal} />
      <dialog className="newBookDialog" ref={modalRef} onKeyDown={preventClose}>
        {children}
      </dialog>
    </>
  );
}

export default forwardRef(ModalComponent);
