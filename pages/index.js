import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [animalInput, setAnimalInput] = useState('');
    const [result, setResult] = useState();
    
    async function onSubmit(event) {
        event.preventDefault();
            try{
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ animal: animalInput }),
                });
            
                const data = await response.json();
                if (response.status !== 200) {
                    throw data.error || new Error(`Request failed with status code ${response.status}`);
                }

                setResult(data.result);
                setAnimalInput('');
            }catch(error){
                console.error(error);
                alert(error.message);
            }
        }

        return (
            <div>
                <Head>
                    <title>Pet Name Generator</title>
                    <link rel="icon" href="/dog.png" />
                </Head>

                <main className={styles.main}>
                    <img src="/dog.png" className={styles.icon} />
                    <h3>Name my pet</h3>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="animal"
                            placeholder="Enter an animal"
                            value={animalInput}
                            onChange={(event) => setAnimalInput(event.target.value)}
                        />
                        <input type="submit" value="Generate names" />
                    </form>
                    <div className={styles.result}>{result}</div>
                </main>
            </div>
        );
}