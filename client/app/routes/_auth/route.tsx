import { Navigate, Outlet, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { getUserSession } from '~/session/auth'


export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await getUserSession(request)
    return { user }
}

const ProtectedRoute: React.FC = () => {
    const { user } = useLoaderData<typeof loader>()
    return user ? <Outlet /> : <Navigate to={"/sign-in"} />
}

export default ProtectedRoute