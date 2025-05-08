import { Navigate, Outlet } from "react-router"
import { validateUserSession } from "utils/auth"

const NotAuthOnlyRoute: React.FC = () => {
    return validateUserSession() ? <Navigate to={"/"} /> : <Outlet />
}

export default NotAuthOnlyRoute