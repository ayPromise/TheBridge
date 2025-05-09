import { Link, useLocation } from "react-router"
import classes from "./Navbar.module.css"
import { Button } from "@mui/material"
import type UserSession from "types/UserSession"
import type { Book } from "types/Book"

interface NavbarProps {
    user: UserSession | null
    books: Book[] | null
}

const Navbar: React.FC<NavbarProps> = ({ user, books }) => {
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


                <ul className="flex flex-col gap-[20px]">
                    {books && books.map((book, index) => {
                        const pathnameID = Number(pathname.split("/").pop()) ?? -1
                        return (<li key={index}><Link to={`book/${book.id}`} className={pathnameID === book.id ? classes.active : ''}>{book.title}</Link></li>)
                    })
                    }
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