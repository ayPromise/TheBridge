import { CircularProgress } from "@mui/material";
import { type LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { setUserSession } from "~/session/auth";

interface CustomError {
    error: string,
    status: number
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { provider } = params;
    const url = new URL(request.url);
    const accessToken = url.searchParams.get("access_token");

    if (!accessToken || !provider) {
        return { error: "Missing access token or provider", status: 400 };
    }

    const backendUrl = import.meta.env.VITE_STRAPI_BACKEND_URL;
    const path = `/api/auth/${provider}/callback`;
    const newUrl = new URL(backendUrl + path)
    newUrl.searchParams.append("access_token", accessToken)

    try {
        const res = await fetch(newUrl);
        const data = await res.json();

        if (data.error) {
            return { error: data.error.message || data.error, status: res.status };
        }

        if (!data.jwt || !data.user) {
            return { error: "Invalid response from authentication server", status: 500 };
        }
        const headers = await setUserSession(request, data.jwt, data.user);
        return redirect("/", { headers })
    } catch (error: any) {
        return { error: "An error occurred while processing the callback", status: 500 };
    }
};

export default function OAuthCallback() {
    const { error, status } = useLoaderData<CustomError>();

    return (
        <div className="w-full h-full flex justify-center items-center text-4xl">
            {error ? (
                <div>{error}</div>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
}