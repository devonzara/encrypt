type Props = {
    message: string,
};

const notice = ({ message }: Props): JSX.Element => {
    return (
        <p className="bg-slate-100 text-gray-500 rounded border-red-500 px-2 py-2 border-l-2 text-xs">
            <span className="font-bold text-red-600 mr-1">NOTICE:</span>
            { message }
        </p>
    );
};

export default notice;
