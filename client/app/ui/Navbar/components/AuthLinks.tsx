import { Link } from "react-router";
import classes from "../Navbar.module.css";

const links = [
    { title: "Sign in", href: "/sign-in" },
    { title: "Sign up", href: "/sign-up" },
];

interface AuthLinkProps {
    currentPath: string
}

const AuthLinks: React.FC<AuthLinkProps> = ({ currentPath }) => {
    return <ul className={classes.navigationList}>
        {links.map((link, index) => (

            <li key={index} className={classes.navigationItem}>
                <Link to={link.href} className={link.href === currentPath ? classes.active : ""}>
                    {link.title}
                </Link>
            </li>
        ))}
    </ul>
};

export default AuthLinks;
