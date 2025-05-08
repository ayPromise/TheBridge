import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { provider } = useParams();
    const [text, setText] = useState('Authenticating...');

    useEffect(() => {
        const accessToken = params.get('access_token')

        if (!accessToken || !provider) {
            console.error('Missing token or provider:', params.toString(), provider);
            setText('An error occurred, please see the developer console.');
            return;
        }

        const backendUrl = import.meta.env.VITE_STRAPI_BACKEND_URL
        const path = `/api/auth/${provider}/callback`

        const newUrl = new URL(backendUrl + path)
        newUrl.searchParams.append("access_token", accessToken)

        const fetchJWT = async () => {
            try {
                const res = await fetch(newUrl)
                const data = await res.json()
                if (data) {
                    localStorage.setItem("jwt", data.jwt)
                    localStorage.setItem("user", JSON.stringify(data.user))
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchJWT()
        navigate({ pathname: "/" })

    }, [navigate, params, provider]);

    return <div className='w-full h-full flex justify-center items-center'>{text}</div>;
}