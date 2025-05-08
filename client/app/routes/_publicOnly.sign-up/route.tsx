import {
    Box,
    Button,
    CircularProgress,
    Container,
    InputLabel,
    TextField,
} from "@mui/material";
import OAuthButtons from "components/OAuthButtons";
import { useState } from "react";
import { type ActionFunctionArgs, redirect, useActionData, useNavigation } from "react-router";
import { setUserSession } from "~/session/auth";

interface FormState {
    email: string;
    password: string;
    username: string;
}

interface ActionData {
    error?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username || !email || !password) {
        console.error("All fields are required");
        return { error: "All fields are required" } as ActionData;
    }

    const backendUrl = import.meta.env.VITE_STRAPI_BACKEND_URL;
    const path = `${backendUrl}/api/auth/local/register`;

    try {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return { error: data.error.message || data.error } as ActionData;
        }

        if (!data.jwt || !data.user) {
            return { error: "Invalid response from authentication server" } as ActionData;
        }

        const headers = await setUserSession(request, data.jwt, data.user);
        return redirect("/", { headers });
    } catch (error: any) {
        return { error: "An error occurred during registration" } as ActionData;
    }
};

export default function RegisterPage() {
    const [form, setForm] = useState<FormState>({ email: "asdas@gmail.com", password: "asd", username: "newUser" });
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const loadingRequest = navigation.state === "submitting";

    return (
        <Container
            maxWidth="sm"
            sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
            <div className="bg-main-extraLight px-6 py-8 rounded-3xl w-[75%]">
                <Box component="form" method="post" noValidate autoComplete="off" sx={{ my: 2 }}>
                    <fieldset>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <TextField
                            required
                            fullWidth
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            autoComplete="username"
                            sx={{ my: 1 }}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            value={form.username}
                        />
                    </fieldset>

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
                            sx={{ my: 1 }}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            value={form.email}
                        />
                    </fieldset>

                    <fieldset>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <TextField
                            required
                            fullWidth
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            sx={{ my: 1 }}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            value={form.password}
                        />
                    </fieldset>

                    <div className={`h-[15px] py-2 my-2 text-red-600 font-extrabold pointer-events-none`}>
                        {!loadingRequest && actionData?.error}
                    </div>

                    <fieldset>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                height: 40,
                                textTransform: "none",
                                fontWeight: "bold",
                            }}
                            disabled={loadingRequest}
                        >
                            {loadingRequest ? (
                                <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </fieldset>
                </Box>
            </div>

            <OAuthButtons loadingRequest={loadingRequest} setLoadingRequest={() => { }} />
        </Container>
    );
}