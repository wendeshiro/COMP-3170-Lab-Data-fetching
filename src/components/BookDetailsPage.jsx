import styles from "./BookDetailsPage.module.css";
import { useState, useEffect } from "react";

export default function BookDetailsPage({ book, onClose }) {
  const [similarBooks, setSimilarBooks] = useState(null);

  useEffect(() => {
    if (!book.publisher) return;

    async function fetchSimilarBooks() {
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
        // Keep only the first 8 items
        const limitedBooks = filteredBooks.slice(0, 8);
        setSimilarBooks({ ...data, books: limitedBooks });
      } catch (error) {
        console.error("Error fetching similar books:", error);
      }
    }

    fetchSimilarBooks();
  }, [book]);

  return (
    <div className={styles.contentContainer}>
      <header className={styles.header}>
        <p className={styles.pageTitle}>Book Details</p>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      </header>

      <div className={styles.bookDetails}>
        <img className={styles.bookImage} src={book.imgSrc} alt={book.imgAlt} />
        <div className={styles.bookInfo}>
          <p className={styles.bookTitle}>{book.bookTitle}</p>
          <p className={styles.bookAuthor}>By {book.bookAuthor}</p>
          <p className={styles.bookPublisher}>Published by {book.publisher}</p>
          <p className={styles.bookYear}>Published in {book.publication}</p>
          <p className={styles.bookPrice}>{book.bookPrice}</p>
          <p className={styles.bookPages}>{book.pages}</p>
          <p className={styles.bookLanguage}>Language: {book.language}</p>
        </div>
      </div>

      <div className={styles.similarBooksSection}>
        <p>Other Books from {book.publisher}</p>
        {similarBooks && similarBooks.books.length > 0 ? (
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
          <p>No Other Books from {book.publisher}</p>
        )}
      </div>
    </div>
  );
}
