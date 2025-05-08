import { Navigate, Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router"
import { getUserSession, validateUserSession } from "~/session/auth"

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await getUserSession(request)
    return { user }
}

const NotAuthOnlyRoute: React.FC = () => {
    const { user } = useLoaderData<typeof loader>()

    return user ? <Navigate to={"/"} /> : <Outlet />
}

export default NotAuthOnlyRoute