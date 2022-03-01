import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import CryptoJS from 'crypto-js';
import Footer from '../components/footer';
import Header from '../components/header';
import Error from '../components/error';
import Spinner from '../components/spinner';
import Button from '../components/button';
import Notice from '../components/notice';

const IndexPage: NextPage = () => {
    const [slug, setSlug] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');

    const doPostRequest = async (data: object) => {
        const response = await fetch('api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (password !== passwordConf) return setError('Passwords do not match.');

        setLoading(true);
        setError('');

        const data = {
            payload: CryptoJS.AES.encrypt(message, password).toString(),
            password: CryptoJS.SHA256(password).toString(),
        };

        const responseData = await doPostRequest(data);

        setSlug(responseData.message.slug);
        setLoading(false);

        if ( ! responseData.success) setError(responseData.error);
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
                        { slug &&
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-700">Share Your Message</h2>
                                    <p className="text-sm">Share the following link and your password with the recipient.</p>
                                </div>
                                <div className={`${styles['content-box']} text-slate-600 w-full overflow-y`}>
                                    { `${window.location.origin}/${slug}` }
                                </div>
                                <Link href="/">
                                    <a className="self-start items-center bg-blue-500 disabled:bg-blue-300 disabled:pointer rounded text-white px-4 py-2">
                                        Encrypt a new message
                                    </a>
                                </Link>
                            </div>
                        }
                        { ! slug &&
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-700">Create a Secure Message</h2>
                                </div>

                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea className={`${styles.input} h-48`} onChange={e => {setMessage(e.target.value);setError('');}}/>

                                <div className="flex gap-4 items-stretch">
                                    <label htmlFor="password" className="sr-only">
                                        Password
                                    </label>
                                    <input className={`${styles.input} w-full`} onChange={e => {setPassword(e.target.value);setError('');}} type="password" placeholder="Password" data-lpignore="true" />

                                    <label htmlFor="passwordConfirmation" className="sr-only">
                                        Password Confirmation
                                    </label>
                                    <input className={`${styles.input} w-full`} onChange={e => {setPasswordConf(e.target.value);setError('');}} type="password" placeholder="Password Confirmation" data-lpignore="true" />
                                </div>

                                <div className="flex gap-4 items-center">
                                    <Button message="Encrypt" disabled={isLoading}/>
                                    {isLoading && <Spinner/>}
                                    {error && <Error message={error}/>}
                                    { ! error && <Notice message="Messages will self-destruct when read or after 30 days."/>}
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default IndexPage;
