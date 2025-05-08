import { Button } from '@mui/material'
import React from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

const backendUrl = import.meta.env.VITE_STRAPI_BACKEND_URL;


interface OAuthButtonsProps {
    loadingRequest: boolean
    setLoadingRequest: (newValue: boolean) => void
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ loadingRequest, setLoadingRequest }) => {

    const handleLogin = (provider: 'google' | 'github') => {
        setLoadingRequest(true)

        const url = new URL(backendUrl + `/api/connect/${provider}`)
        window.location.href = url.href

        setLoadingRequest(false)
    };

    return (
        <div className="w-[75%] px-6 py-6 bg-main-extraLight rounded-3xl mt-4">
            <Button startIcon={<FaGoogle />} onClick={() => handleLogin('google')} variant="contained"
                fullWidth
                sx={{
                    mb: 1,
                    backgroundColor: "white", color: "black"
                }}
                disabled={loadingRequest}
            >
            </Button>

            <Button
                startIcon={<FaGithub />}
                onClick={() => handleLogin('github')}
                variant="contained"
                sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
                fullWidth
                disabled={loadingRequest}
            >
            </Button>
        </div>
    )
}

export default OAuthButtons