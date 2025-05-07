import { useLocation } from "react-router"
import classes from "./Navbar.module.css"

const Navbar = () => {
    const { pathname } = useLocation()
    const links = [
        {
            title: 'Sign up',
            href: '/sign-up'
        },
        {
            title: 'Sign in',
            href: '/sign-in'
        },
        {
            title: 'Books',
            href: '/books'
        }
    ]


    return (
        <nav
            className={classes.navbar}>
            <ul className={classes.navigationList}>
                {links.map(((link, index) => (<li key={index}>
                    <a href={link.href} className={link.href === pathname ? classes.active : ''}> {link.title}</a>
                </li>)))}
            </ul>
        </nav>
    )
}

export default Navbar