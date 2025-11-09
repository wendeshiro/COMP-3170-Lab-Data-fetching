import styles from "./BookDetailsPage.module.css";
import { useState, useEffect } from "react";

export default function BookDetailsPage({ book, onClose }) {
  const [similarBooks, setSimilarBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!book.publisher) return;

    async function fetchSimilarBooks() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.itbook.store/1.0/search/${book.publisher}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        // Filter out any similar book that has the same URL as the current book
        // If book.url is undefined, the filter will keep all items.
        const filteredBooks = Array.isArray(data.books)
          ? data.books.filter((b) => b.url !== book.url)
          : [];
        // Keep only the first 12 items
        const limitedBooks = filteredBooks.slice(0, 12);
        setSimilarBooks({ ...data, books: limitedBooks });
      } catch (err) {
        console.error("Error fetching similar books:", err);
        setError(err.message || "Failed to fetch similar books");
      } finally {
        setLoading(false);
      }
    }

    fetchSimilarBooks();
  }, [book]);

  return (
    <div className={styles.contentContainer}>
      <header className={styles.header}>
        <p className={styles.pageTitle}>Book Details</p>
        <button className={styles.closeButton} onClick={onClose}>
          Back
        </button>
      </header>

      <div className={styles.bookDetails}>
        <img className={styles.bookImage} src={book.imgSrc} alt={book.imgAlt} />
        <div className={styles.bookInfo}>
          <p className={styles.bookTitle}>{book.bookTitle}</p>
          <p className={styles.bookAuthor}>By {book.bookAuthor}</p>
          <table className={styles.bookInfoTable}>
            <tbody>
              <tr>
                <td>Publisher</td>
                <td>{book.publisher}</td>
              </tr>
              <tr>
                <td>Published</td>
                <td>{book.publication}</td>
              </tr>
              <tr>
                <td>Price</td>
                <td>{book.bookPrice}</td>
              </tr>
              <tr>
                <td>Pages</td>
                <td>{book.pages}</td>
              </tr>
              <tr>
                <td>Language</td>
                <td>{book.language}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.similarBooksSection}>
        <p className={styles.similarBooksTitle}>Other Books from {book.publisher}</p>
        <div className={styles.similarBooksList}>
          {loading ? (
            <p>Loading other books from {book.publisher}</p>
          ) : error ? (
            <p>No other books from {book.publisher}</p>
          ) : similarBooks && similarBooks.books.length > 0 ? (
            similarBooks.books.map((similarBook) => (
              <div key={similarBook.isbn13} className={styles.similarBook}>
                <a href={similarBook.url} target="_blank">
                  <img src={similarBook.image} alt={similarBook.title} />
                </a>
                <p className={styles.similarBookTitle}>{similarBook.title}</p>
                <p className={styles.similarBookPrice}>{similarBook.price}</p>
              </div>
            ))
          ) : (
            <p>No other books from {book.publisher}</p>
          )}
        </div>
      </div>
    </div>
  );
}
