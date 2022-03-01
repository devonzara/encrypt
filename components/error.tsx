type Props = {
    message: string,
};

const error = ({ message }: Props): JSX.Element => {
    return <span className="text-red-600 text-sm">Error: {message}</span>;
};

export default error;
