import { type LoaderFunctionArgs, redirect } from "react-router";
import { clearUserSession } from "~/session/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const headers = await clearUserSession(request);
    return redirect("/sign-in", { headers });
};