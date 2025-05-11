import { clearBooks } from "features/books/booksSlice";
import { clearChapters } from "features/chapters/chapterSlice";
import { type LoaderFunctionArgs, redirect } from "react-router";
import { store } from "store";
import { clearUserSession } from "~/session/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const headers = await clearUserSession(request);
    store.dispatch(clearBooks())
    store.dispatch(clearChapters())
    return redirect("/sign-in", { headers });
};