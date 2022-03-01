type Props = {
    message: string,
    onClick?: () => void,
    disabled?: boolean,
}

const button = ({ message, onClick, disabled }: Props): JSX.Element => {
    return (
        <button onClick={onClick} className="items-center bg-blue-500 disabled:bg-blue-300 disabled:pointer rounded text-white px-4 py-2" disabled={disabled}>
            {message}
        </button>
    );
};

export default button;
