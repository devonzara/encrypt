import styles from '../styles/Home.module.css';

const header = () => {
    return (
        <>
            <h1 className={styles.title}>Encrypt</h1>

            <p className={styles.description}>
                Send messages, securely.
            </p>
        </>
    );
};

export default header;
