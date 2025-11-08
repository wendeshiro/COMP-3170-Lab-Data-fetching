import styles from "./NewBook.module.css";

export default function NewBook({ onClick }) {
    return (
        <button className={styles.newBookContainer} onClick={onClick}>
            <div className={styles.pulsBtn}>Add New Book</div>
        </button>
    );
}
