import styles from "./App.module.css";
import Header from "./components/Header";
import Book from "./components/Book";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import NewBookDialog from "./components/NewBookDialog";
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import initialBooks from "../data/books.json";
import LoanPage from "./components/LoanPage";

export default function App() {
  const modalRef = useRef();

  const [dialogKey, setDialogKey] = useState(0);

  const [books, setBooks] = useState(() => {
    // first tries to load saved books from localStorage.
    try {
      const raw = localStorage.getItem("books");
      if (raw) {
        const saved = JSON.parse(raw);
        // ensure each saved book has selected flag
        return saved.map((b) => ({ ...b, selected: !!b.selected }));
      }
    } catch (e) {
      console.error("failed to load books from localStorage", e);
    }

    return initialBooks.map((b) => ({
      id: nanoid(),
      imgSrc: b.image,
      imgAlt: b.title,
      bookLink: b.url,
      bookTitle: b.title,
      bookPrice: b.price,
      bookAuthor: b.author,
      publisher: b.Publisher,
      publication: b["Publication Year"],
      pages: b.Pages,
      language: b.Language,
      selected: false,
    }));
  });

  // update books to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("books", JSON.stringify(books));
    } catch (e) {
      console.error("failed to save books to localStorage", e);
    }
  }, [books]);

  const addBook = (newBook) => {
    const bookWithId = { id: nanoid(), selected: false, ...newBook };
    setBooks((current) => [...current, bookWithId]);
  };

  const [editingBook, setEditingBook] = useState(null);

  const editBook = (updatedBook) => {
    setBooks(
      (current) => current.map((b) => (b.id === updatedBook.id ? { ...b, ...updatedBook } : b)) // Use spread operator to merge old and new data; same keys are updated
    );
    setEditingBook(null); // Clear editing state after edit
  };

  const selectBook = (id) => {
    setBooks(
      (current) =>
        current.map((book) => ({ ...book, selected: book.id === id ? !book.selected : false })) // change selected property of book object
    );
  };

  const deleteSelected = () => {
    // const selected = books.filter((b) => b.selected); // keep only selected=true books
    // if (selected.length === 0) return; // check if any book is selected, exit deleteSelected function if none
    // if (selected.some((b) => b.loaned)) return; // check if any selected book is on loan(true), exit if true

    setBooks((current) => current.filter((book) => !book.selected));
  };

  // Publisher filter state (for filtering the list by publisher)
  const publishers = Array.from(new Set(books.map((b) => b.publisher).filter(Boolean))); // get unique, non-empty publishers; convert it to Array
  const [publisherFilter, setPublisherFilter] = useState("");

  const handleEditClick = () => {
    const selected = books.filter((b) => b.selected); // keep only selected=true books
    if (selected.length === 0) {
      alert("Please select a book to edit.");
      return;
    }
    if (selected.length > 1) {
      alert("Please select only one book to edit.");
      return;
    }

    // if (selected[0].loaned) return; // do nothing if the selected book is loaned(true)

    setEditingBook(selected[0]);
    if (modalRef.current) modalRef.current.show(); // imperative call to show modal
  };

  const [showLoanPage, setShowLoanPage] = useState(false);

  // control edit/delete availability ↓
  const selectedBooks = books.filter((b) => b.selected);
  const hasSelectedLoaned = selectedBooks.some((b) => b.loaned); // get boolean indicating if any selected book is on loan
  const canEdit = selectedBooks.length === 1 && !hasSelectedLoaned; // one book selected and loaned=false
  const canDelete = selectedBooks.length > 0 && !hasSelectedLoaned; // at least one book selected and loaned=false

  // from LoanPage: update book loaned status
  const handleLoan = (record) => {
    const { bookId } = record || {}; // object destructuring: destructure bookId from record(in LoanPage.jsx)
    if (!bookId) return;
    setBooks((current) =>
      current.map((b) =>
        b.id === bookId
          ? {
              ...b,
              loaned: true,
              loanInfo: {
                borrower: record.borrower,
                loanPeriod: record.loanPeriod,
                timestamp: record.timestamp,
              },
            }
          : b
      )
    );
  };

  return (
    <div className={styles.appContainer}>
      <Header />
      {showLoanPage ? (
        <LoanPage onBack={() => setShowLoanPage(false)} books={books} onLoan={handleLoan} />
      ) : (
        <>
          <div className={styles.actionsBar}>
            <div className={styles.filters}>
              <label>Filter by Publisher:</label>
              <select value={publisherFilter} onChange={(e) => setPublisherFilter(e.target.value)}>
                {/* "value" of a <select> represents the currently selected option’s value; target = selected option */}
                <option value="">All</option>
                {publishers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <button className={styles.manageLoansBtn} onClick={() => setShowLoanPage(true)}>
              Manage Loans
            </button>
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.actions}>
              <Modal ref={modalRef}>
                {/* dialog used for both add and edit */}
                <NewBookDialog
                  key={editingBook?.id ?? dialogKey}
                  onAddBook={addBook}
                  onEditBook={editBook}
                  initialBook={editingBook}
                  onClose={() => {
                    setEditingBook(null);
                    if (modalRef.current) modalRef.current.close();
                    // bump key to force remount and clear uncontrolled form values
                    setDialogKey((k) => k + 1);
                  }}
                />
              </Modal>
              <button
                className={styles.editBtn}
                onClick={handleEditClick}
                disabled={!canEdit} // canEdit = true → disabled = false
                // hover tooltip messages ↓
                title={
                  !canEdit
                    ? hasSelectedLoaned
                      ? "Cannot edit a book that is on loan"
                      : "Select one book to edit"
                    : ""
                }
              >
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={deleteSelected}
                disabled={!canDelete}
                title={
                  !canDelete
                    ? hasSelectedLoaned
                      ? "Cannot delete book that is on loan"
                      : "Select book to delete"
                    : ""
                }
              >
                Delete
              </button>
            </div>

            <div className={styles.bookList}>
              {books
                .filter((book) =>
                  publisherFilter === "" ? true : book.publisher === publisherFilter
                )
                .map((bookData) => (
                  <Book
                    key={bookData.id}
                    imgSrc={bookData.imgSrc}
                    imgAlt={bookData.bookTitle}
                    bookLink={bookData.bookLink}
                    bookTitle={bookData.bookTitle}
                    bookPrice={bookData.bookPrice}
                    bookAuthor={bookData.bookAuthor}
                    selected={bookData.selected}
                    loaned={bookData.loaned}
                    onSelect={() => selectBook(bookData.id)}
                  />
                ))}
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
