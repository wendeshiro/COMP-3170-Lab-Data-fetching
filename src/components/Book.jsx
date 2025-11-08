import styles from "./Book.module.css";

export default function Book({
  imgSrc,
  imgAlt,
  bookLink,
  bookTitle,
  bookPrice,
  bookAuthor,
  selected,
  loaned,
  onSelect,
}) {
  return (
    <div
      className={`${styles.bookContainer} ${selected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      {loaned && <span className={styles.loanTag}>On loan</span>}
      <a href={bookLink} target="_blank" onClick={(e) => e.stopPropagation()}>
        <img className={styles.bookImage} src={imgSrc} alt={imgAlt} />
      </a>
      <a
        className={styles.bookTitle}
        href={bookLink}
        target="_blank"
        title={bookTitle}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.titleText}>{bookTitle}</span>
      </a>
      <p className={styles.bookAuthor}>
        <span className={styles.authorText}>By {bookAuthor}</span>
      </p>
      <p className={styles.bookPrice}>{bookPrice}</p>
    </div>
  );
}
