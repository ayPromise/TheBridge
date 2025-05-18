import { Link, useLocation } from "react-router";
import styles from "./Navbar.module.css";
import { useState } from "react";

// components
import AuthLinks from "./components/AuthLinks";
import BookSelection from "./components/BookSelection";
import SignOutButton from "./components/SignOutButton";
import Copyright from "./components/Copyright";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// types
import type IUserSession from "types/User";
import ImportButton from "components/ImportButton";

interface NavbarProps {
    user: IUserSession | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const { pathname } = useLocation();
    const [isExpandedNavbar, setIsExpandedNavbar] = useState<boolean>(true)

    return (
        <nav className={`${styles.navbar} ${!isExpandedNavbar ? styles.navbarHidden : ""}`}>

            <div className={styles.hideNavbarButton} onClick={() => setIsExpandedNavbar(!isExpandedNavbar)}>
                <ChevronLeftIcon className={`${styles.hideNavbarIcon} ${isExpandedNavbar ? styles.hideNavbarIconRight : styles.hideNavbarIconLeft}`} />
            </div>

            <h1 className="uppercase text-4xl underline px-[40px] pt-[60px]">
                <Link to="/">BRIDGE</Link>
            </h1>

            <div className={styles.navigationContainer}>
                {!user && <AuthLinks currentPath={pathname} />}

                <BookSelection currentPath={pathname} />
            </div>

            <div className="px-[40px] w-[300px]">
                {user && <ImportButton />}
                {user && <SignOutButton />}
                <Copyright />
            </div>
        </nav>
    );
};

export default Navbar;
