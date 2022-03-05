import { FormEventHandler, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import CryptoJS from 'crypto-js';
import styles from '../styles/Home.module.css';
import Header from '../components/header';
import Footer from '../components/footer';
import Button from '../components/button';
import Spinner from '../components/spinner';
import Error from '../components/error';

type Props = {
    exists: boolean,
    slug?: string,
};

const MessagePage: NextPage<Props> = ({ exists, slug }: Props) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [rawMessage, setRawMessage] = useState('');

    const doPostRequest = async (postData: object) => {
        setLoading(true);

        const response = await fetch(`/api/${slug}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        const responseData = await response.json();

        setLoading(false);
        return responseData;
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault();
        setError('');

        const responseData = await doPostRequest({
            password: CryptoJS.SHA256(password).toString(),
        });

        if ( ! responseData.success) return setError(responseData.error);
        setRawMessage(CryptoJS.AES.decrypt(responseData.data.payload, password).toString(CryptoJS.enc.Utf8));
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Encrypt - Send messages, securely.</title>
                <meta name="description" content="A secure way to send self-destructing messages." />
            </Head>

            <main className={styles.main}>
                <Header />

                <div className={styles.grid}>
                    <div className={styles.card}>
                        { (exists && rawMessage) &&
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-700">Decrypted Message</h2>
                                    <p className="text-sm">This message has self-destructed and cannot be accessed again.</p>
                                </div>
                                <div className={`${styles['content-box']} text-slate-600 w-full h-48 overflow-y break-words overflow-y-scrollgit`}>{ rawMessage }</div>
                                <Link href="/">
                                    <a className="self-start items-center bg-blue-500 disabled:bg-blue-300 disabled:pointer rounded text-white px-4 py-2">
                                        Encrypt a new message
                                    </a>
                                </Link>
                            </div>
                        }

                        { (exists && ! rawMessage) &&
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <p>Enter the password to decrypt this message.</p>

                                <div className="flex gap-4 items-stretch">
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input className={`${styles.input} w-full`} onChange={e => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }} type="password" placeholder="Password" data-lpignore="true" />
                                </div>

                                <div className="flex gap-4 items-center">
                                    <Button message="Decrypt Message" disabled={isLoading}/>
                                    {isLoading && <Spinner/>}
                                    {error && <Error message={error}/>}
                                </div>
                            </form>
                        }

                        { ! exists &&
                            <div className="text-center">
                                <p className="font-bold">This message no longer exists. </p>
                                <Link href="/">
                                    <a className="text-blue-500">Encrypt a new message.</a>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// @ts-ignore
export async function getServerSideProps({ req, query }) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
    const response = await fetch(`${baseUrl}/api/${query.slug}`);
    const { data } = await response.json();

    return {
        props: {
            exists: data.exists,
            slug: query.slug,
        },
    };
}

export default MessagePage;
