import {
    Box,
    Button,
    CircularProgress,
    Container,
    InputLabel,
    Link,
    TextField,
} from "@mui/material";
import OAuthButtons from "components/OAuthButtons";
import { serverAPIRoutes } from "consts/endpoints";
import { useState } from "react";
import { type ActionFunctionArgs, useActionData, useNavigation } from "react-router";
import { redirect } from "react-router";
import { setUserSession } from "~/session/auth";

interface FormState {
    email: string;
    password: string;
}

interface ActionData {
    error?: string;
}

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL;


export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" } as ActionData;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return { error: "Please enter a valid email address" } as ActionData;
    }

    const path = new URL(`${SERVER_URL}${serverAPIRoutes.singIn}`);

    try {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier: email,
                password,
            }),
        });

        const data = await response.json();
        if (data.error) {
            return {
                error: data.error.message === "Invalid identifier or password"
                    ? "Invalid email or password"
                    : data.error.message || data.error,
            } as ActionData;
        }

        if (!data.jwt || !data.user) {
            return { error: "Invalid response from authentication server" } as ActionData;
        }

        const headers = await setUserSession(request, data.jwt, data.user);
        return redirect("/", { headers });
    } catch (error: any) {
        return { error: "An error occurred during sign-in" } as ActionData;
    }
};

export default function SignInPage() {
    const [form, setForm] = useState<FormState>({ email: "", password: "" });
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const loadingRequest = navigation.state === "submitting";

    return (
        <Container
            maxWidth="sm"
            sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
            <div className="bg-main-extraLight px-6 py-8 rounded-3xl w-[75%]">
                <Box component="form" method="post" noValidate autoComplete="off" sx={{ mt: 2 }}>
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
                            value={form.email}
                        />
                    </fieldset>

                    <fieldset>
                        <div className="relative">
                            <InputLabel htmlFor="password" sx={{ mt: 2 }}>
                                Password
                            </InputLabel>
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
                                py: 1.5,
                                height: 40,
                                textTransform: "none",
                                fontWeight: "bold",
                            }}
                            disabled={loadingRequest}
                        >
                            {loadingRequest ? (
                                <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </fieldset>
                </Box>
            </div>

            <OAuthButtons loadingRequest={loadingRequest} setLoadingRequest={() => { }} />
        </Container>
    );
}