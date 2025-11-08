import styles from "./NewBookDialog.module.css";

export default function NewBookDialog({ onAddBook, onEditBook, initialBook, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const payload = {
      imgSrc: data.get("imgSrc") || "",
      imgAlt: data.get("bookTitle") || "",
      bookLink: data.get("bookLink") || "",
      bookTitle: data.get("bookTitle") || "",
      bookPrice: data.get("bookPrice") || "",
      bookAuthor: data.get("bookAuthor") || "",
      publisher: data.get("publisher") || "",
      publication: data.get("publication") || "",
      pages: data.get("pages") || "",
      language: data.get("language") || "",
    };

    if (initialBook && initialBook.id) {
      onEditBook && onEditBook({ id: initialBook.id, ...payload });
    } else {
      onAddBook && onAddBook(payload);
    }

    e.currentTarget.reset();
    onClose && onClose();
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  // const handleBackdropClick = (e) => {
  //   if (e.target === e.currentTarget) {
  //     closeDialog();
  //   }
  // };

  return (
    <div className={styles.dialogContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>{initialBook ? "Edit Book" : "Add Your New Book"}</p>

        <div className={styles.inputs}>
          <label htmlFor="bookTitle">Title</label>
          <input
            type="text"
            id="bookTitle"
            name="bookTitle"
            defaultValue={initialBook?.bookTitle || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="bookPrice">Price</label>
          <input
            type="text"
            id="bookPrice"
            name="bookPrice"
            defaultValue={initialBook?.bookPrice || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="bookAuthor">Author</label>
          <input
            type="text"
            id="bookAuthor"
            name="bookAuthor"
            defaultValue={initialBook?.bookAuthor || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="publisher">Publisher</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            defaultValue={initialBook?.publisher || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="publication">Publication Year</label>
          <input
            type="number"
            min="1500"
            id="publication"
            name="publication"
            defaultValue={initialBook?.publication || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="pages">Pages</label>
          <input
            type="number"
            min="0"
            id="pages"
            name="pages"
            defaultValue={initialBook?.pages || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="language">Language</label>
          <input
            type="text"
            id="language"
            name="language"
            defaultValue={initialBook?.language || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="imgSrc">Book Cover URL</label>
          <input
            type="url"
            id="imgSrc"
            name="imgSrc"
            defaultValue={initialBook?.imgSrc || ""}
            required
          />
        </div>

        <div className={styles.inputs}>
          <label htmlFor="bookLink">Book Link</label>
          <input
            type="url"
            id="bookLink"
            name="bookLink"
            defaultValue={initialBook?.bookLink || ""}
            required
          />
        </div>

        <div className={styles.actionButtons}>
          <button type="submit" className={styles.addButton}>
            Submit
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
