import { Link } from "react-router";

// components
import { Button } from "@mui/material";

const SignOutButton: React.FC = () => {
    return (
        <Link to="/sign-out">
            <Button variant="contained" color="error" fullWidth>
                Sign Out
            </Button>
        </Link>
    );
};

export default SignOutButton;
