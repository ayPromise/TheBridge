import { Link, useLocation } from "react-router"
import classes from "./Navbar.module.css"
import { Button } from "@mui/material"
import type UserSession from "types/UserSession"

interface NavbarProps {
    user: UserSession | null
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const { pathname } = useLocation()

    const onlyPublicLinks = [
        {
            title: 'Sign in',
            href: '/sign-in'
        },
        {
            title: 'Sign up',
            href: '/sign-up'
        }
    ]

    return (
        <nav
            className={classes.navbar}>
            <div className={classes.navigationContainer}>


                <ul className={classes.navigationList}>
                    {!user && onlyPublicLinks.map(((link, index) => (<li key={index} className={classes.navigationItem}>
                        <Link to={link.href} className={link.href === pathname ? classes.active : ''}> {link.title}</Link>
                    </li>)))}
                </ul>
            </div>

            <div className="flex flex-col gap-[50px]">
                {user && <Link to={"/sign-out"}>
                    <Button variant="contained" color="error" fullWidth>Sign Out</Button>
                </Link>}

                <div className={classes.copyright}>
                    Copyright ©ayPromise
                </div>
            </div>
        </nav>
    )
}

export default Navbar