import { useState } from "react";
import styles from "./LoanPage.module.css";

export default function LoanPage({ onBack, books = [], onLoan }) {
  const [borrower, setBorrower] = useState("");
  const [selectedBook, setSelectedBook] = useState(""); // store book id
  const [loanPeriod, setLoanPeriod] = useState(1);
  // ↓ data structure { bookId, borrower, loanPeriod, timestamp } ↓
  const [loanRecords, setLoanRecords] = useState([]);

  const initialLoanedBooks = books.filter((b) => b.loaned); // loaned books stored in App.jsx
  const initiallyLoanedIds = initialLoanedBooks.map((lb) => lb.id); // extract their ids

  const currentLoanedIds = new Set([...initiallyLoanedIds, ...loanRecords.map((r) => r.bookId)]); // combine initial and newly loaned book ids, duplicates are removed
  const availableBooks = books.filter((b) => !currentLoanedIds.has(b.id)); // a Set method that checks if the value exists in the set

  const loanMap = new Map();
  initialLoanedBooks.forEach((lb) => {
    const info = lb.loanInfo || {};
    loanMap.set(lb.id, {
      bookId: lb.id,
      borrower: info.borrower,
      loanPeriod: info.loanPeriod,
      timestamp: info.timestamp,
      bookTitle: lb.bookTitle,
    });
  });
  loanRecords.forEach((r) => {
    // newer records overwrite any persisted entry for the same book
    const title = (books.find((b) => b.id === r.bookId) || {}).bookTitle; // get book title from books list from App.jsx
    loanMap.set(r.bookId, {
      bookId: r.bookId,
      borrower: r.borrower,
      loanPeriod: r.loanPeriod,
      timestamp: r.timestamp,
      bookTitle: title,
    });
  });
  const combinedLoans = Array.from(loanMap.values()); // convert Map values to Array

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page refreshing
    if (!selectedBook) return; // prevent submitting without a selected book
    if (!borrower) return; // prevent submitting without borrower name

    const newRecord = {
      bookId: selectedBook,
      borrower,
      loanPeriod,
      timestamp: Date.now(), // current time in ms
    };

    setLoanRecords((cur) => [...cur, newRecord]);

    // Ask App.jsx to mark the book as loaned.
    if (typeof onLoan === "function") {
      try {
        onLoan(newRecord);
      } catch (err) {
        // swallow errors from parent callback function so the current logic continues safely.
        console.error("onLoan callback failed", err);
      }
    }

    // clear inputs
    setSelectedBook("");
    setBorrower("");
    setLoanPeriod(1);
  };

  return (
    <div className={styles.pageContainer}>
      <header>
        <p className={styles.title}>Manage Loans</p>
        <button className={styles.backBtn} onClick={onBack}>
          Back
        </button>
      </header>

      <main>
        {availableBooks.length === 0 ? (
          <p className={styles.noBooksMessage}>There are no available books to borrow</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.loanForm}>
            <p className={styles.loanTitle}>Loan a Book</p>
            <label htmlFor="borrower">Borrower</label>
            <input
              type="text"
              id="borrower"
              name="borrower"
              placeholder="Name"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              required
            />

            <label htmlFor="book">Book</label>
            <select
              id="book"
              name="book"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Select a book</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bookTitle}
                </option>
              ))}
            </select>

            <label htmlFor="loanPeriod">Loan Period (in weeks)</label>
            <input
              type="number"
              id="loanPeriod"
              name="loanPeriod"
              placeholder="in weeks"
              min="1"
              max="4"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(Number(e.target.value))} // value = string in <input>, convert to number
            />

            <button type="submit">Submit</button>
          </form>
        )}
        <hr />
        <div className={styles.loanedContainer}>
          <p className={styles.loanedTitle}>Currently on loan</p>
          <div className={styles.bookList}>
            {combinedLoans.length === 0 ? (
              <p className={styles.noLoansMessage}>No current loans</p>
            ) : (
              <>
                {combinedLoans.map((entry) => {
                  const dueStr =
                    entry.timestamp && entry.loanPeriod
                      ? new Date(
                          entry.timestamp + entry.loanPeriod * 7 * 24 * 60 * 60 * 1000 // convert period to ms
                        ).toLocaleDateString() // format as date string
                      : "unknown";
                  return (
                    <div key={entry.bookId} className={styles.bookItem}>
                      <p>Borrower Name: {entry.borrower}</p>
                      <p>Book Title: {entry.bookTitle}</p>
                      <p>Due Date: {dueStr}</p>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
