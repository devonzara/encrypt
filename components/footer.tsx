import styles from '../styles/Home.module.css';

const footer = () => {
    return (
        <footer className={styles.footer}>
            Created with <span className="animate-throb inline-block text-red-600">❤</span> in West Virginia.
            <small className="block">Copyright &copy; {new Date().getFullYear()}.</small>
        </footer>
    );
};

export default footer;
