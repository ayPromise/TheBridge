import { Box, Button, CircularProgress, Container, InputLabel, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { setUserSession } from "utils/auth";
const backendUrl = import.meta.env.VITE_STRAPI_BACKEND_URL;

interface FormState {
    email: string;
    password: string;
}

export default function SignInPage() {
    const [form, setForm] = useState<FormState>({ email: '', password: '' })
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const handleLogin = (provider: 'google' | 'github') => {
        setLoadingRequest(true)

        const url = new URL(backendUrl + `/api/connect/${provider}`)
        window.location.href = url.href

        setLoadingRequest(false)
    };

    const handleCredentialsLogin = async (event: any) => {
        event.preventDefault()
        const path = new URL(backendUrl + '/api/auth/local')
        if (form.email && form.password) {
            setLoadingRequest(true)
            const response = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier: form.email,
                    password: form.password
                })
            })

            const data = await response.json()

            setTimeout(() => {
                setLoadingRequest(false)
            }, 1000)

            if (data.error && data.error.message === 'Invalid identifier or password')
                setError('Invalid email or password')

            setUserSession(data.jwt, data.user)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="bg-main-extraLight px-6 py-8 rounded-3xl w-[75%]">
                <Box component="form" onSubmit={handleCredentialsLogin} noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <fieldset>
                        <InputLabel htmlFor="email">Email address</InputLabel>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            sx={{ mt: 1 }}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </fieldset>

                    <fieldset>

                        <div className="relative">
                            <InputLabel htmlFor="password" sx={{ mt: 2 }}>Password</InputLabel>
                            <Link href="#" underline="hover" fontSize="0.875rem" className="absolute top-0 right-0">
                                Forgot password?
                            </Link>
                        </div>


                        <TextField
                            required
                            fullWidth
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            sx={{ mt: 1 }}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </fieldset>

                    <div className={`h-[15px] py-2 my-2 text-red-600 font-extrabold pointer-events-none`}>
                        {!loadingRequest && error}
                    </div>

                    <fieldset>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                height: 40,
                                textTransform: 'none',
                                fontWeight: 'bold',
                            }}
                            loading={loadingRequest}
                            loadingIndicator={<CircularProgress size={24} sx={{
                                color: 'white',
                            }} />}
                        >
                            Sign In
                        </Button>
                    </fieldset>
                </Box>
            </div>

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
        </Container>
    );
}
