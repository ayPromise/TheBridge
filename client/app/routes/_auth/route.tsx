import { Navigate, Outlet } from 'react-router'
import { validateUserSession } from 'utils/auth'

const ProtectedRoute: React.FC = () => {
    return validateUserSession() ? <Outlet /> : <Navigate to={"/sign-in"} />
}

export default ProtectedRoute