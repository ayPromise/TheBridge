import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";

import "./app.css"

// session
import { getJwt, getUserSession } from "~/session/auth";

// components
import { Grid } from "@mui/material";
import NameLabel from "components/NameLabel";
import Navbar from "./ui/Navbar/Navbar";

// redux
import ReduxProvider from "store/ReduxProvider";
import { setBooks } from "features/books/booksSlice";
import { useDispatch } from "react-redux";

// types
import type { IBook } from "types/Book";
import type { Route } from "./+types/root";
import type IUserSession from "types/User";
import fetchDataJWT from "utils/fetchDataJWT";
import type { AppDispatch } from "store";

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request)

  console.log(user)

  try {
    const apiPath = `/api/books`
    const newURL = new URL(SERVER_URL + apiPath)
    const jwt = await getJwt(request)
    const books = await fetchDataJWT(newURL, jwt)

    return { books: books as IBook[] | [], user: user as IUserSession | null }
  } catch {
    return { books: [], user: user as IUserSession | null }
  }
}

export default function App() {
  const { user, books } = useLoaderData<typeof loader>()
  const dispatch = useDispatch<AppDispatch>()
  dispatch(setBooks(books))


  return <Grid container spacing={2} className="bg-secondary-extraLight font-typo text-white">
    <NameLabel user={user} />
    <Grid size={2}>
      <Navbar user={user} />
    </Grid>
    <Grid size={10}>
      <Outlet />
    </Grid>
  </Grid>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}