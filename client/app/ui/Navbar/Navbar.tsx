import { Link, useLocation } from "react-router"
import classes from "./Navbar.module.css"

const Navbar = () => {
    const { pathname } = useLocation()
    const links = [
        {
            title: 'Books',
            href: '/books'
        },
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
            <ul className={classes.navigationList}>
                {links.map(((link, index) => (<li key={index} className={classes.navigationItem}>
                    <Link to={link.href} className={link.href === pathname ? classes.active : ''}> {link.title}</Link>
                </li>)))}
            </ul>
        </nav>
    )
}

export default Navbar