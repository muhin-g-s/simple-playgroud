// import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

const baseUrl = '/playground.html';

export function PreviewComponent() {
  const [, setUrl] = useState('');
    const ref = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        window.onmessage = ({ data }) => {
            try {
                data = JSON.parse(data);
                setUrl(data.pathname.replace(baseUrl, '') + data.hash)
            }
						catch (e) {
							console.log(e)
						} 
        }
    }, []);

    // const updateUrl = (e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
    // const reload = () => ref.current?.contentWindow?.location.reload();
    // const replace = () => ref.current?.contentWindow?.location.replace(baseUrl + url);
    // const goToUrl = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && replace();

    return (
        <div className={styles.container}>
            {/* <Navigation>
                <Button onClick={reload}>&#11118;</Button>
                <Input type="text" value={url} onChange={updateUrl} onKeyDown={goToUrl} />
                <Button onClick={replace}>&#10150;</Button>
            </Navigation> */}
            <iframe ref={ref} src={baseUrl} sandbox="allow-same-origin allow-scripts" className={styles.preview}/>
        </div>
    );
}