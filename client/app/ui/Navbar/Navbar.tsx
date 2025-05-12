import { Link, useLocation } from "react-router";
import classes from "./Navbar.module.css";

// components
import AuthLinks from "./components/AuthLinks";
import BookSelection from "./components/BookSelection";
import SignOutButton from "./components/SignOutButton";
import Copyright from "./components/Copyright";

// types
import type IUserSession from "types/User";
import ImportButton from "components/ImportButton";

interface NavbarProps {
    user: IUserSession | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const { pathname } = useLocation();

    return (
        <nav className={classes.navbar}>
            <h1 className="uppercase text-4xl underline">
                <Link to="/">BRIDGE</Link>
            </h1>

            <div className={classes.navigationContainer}>
                {!user && <AuthLinks currentPath={pathname} />}

                <BookSelection currentPath={pathname} />
            </div>

            <div className="flex flex-col gap-[50px]">
                {user && <ImportButton />}
                {user && <SignOutButton />}
                <Copyright />
            </div>
        </nav>
    );
};

export default Navbar;
