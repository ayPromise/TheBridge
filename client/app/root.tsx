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

// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// session
import { getJwt, getUserSession } from "~/session/auth";
import fetchDataJWT from "utils/fetchDataJWT";
import { serverAPIRoutes } from "consts/endpoints";

// components
import { Grid } from "@mui/material";
import NameLabel from "components/NameLabel";
import Navbar from "./ui/Navbar/Navbar";

// redux
import ReduxProvider from "store/ReduxProvider";
import { setBooks } from "features/books/booksSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store";

// types
import type { IBook } from "types/Book";
import type { Route } from "./+types/root";
import type IUserSession from "types/User";

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
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request)

  try {
    const newURL = new URL(`${SERVER_URL}${serverAPIRoutes.books}`)
    const jwt = await getJwt(request)
    const books = await fetchDataJWT(newURL, jwt)

    return { booksFromDatabase: books as IBook[] | [], user: user as IUserSession | null }
  } catch {
    return { booksFromDatabase: [], user: user as IUserSession | null }
  }
}

export default function App() {
  const { user, booksFromDatabase } = useLoaderData<typeof loader>()
  const dispatch = useDispatch<AppDispatch>()

  dispatch(setBooks(booksFromDatabase))


  return <Grid container className="bg-secondary-extraLight font-typo text-white">
    <NameLabel user={user} />
    <Navbar user={user} />
    <Outlet />
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