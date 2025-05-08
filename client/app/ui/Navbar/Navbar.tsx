import { Link, useLocation } from "react-router"
import classes from "./Navbar.module.css"
import SplitButton from "./SplittedButton"

const Navbar: React.FC = () => {
    const { pathname } = useLocation()
    const navigationLinks = [
        {
            title: 'Books',
            href: '/books'
        }
    ]

    return (
        <nav
            className={classes.navbar}>
            <div className={classes.navigationContainer}>


                <ul className={classes.navigationList}>
                    {navigationLinks.map(((link, index) => (<li key={index} className={classes.navigationItem}>
                        <Link to={link.href} className={link.href === pathname ? classes.active : ''}> {link.title}</Link>
                    </li>)))}
                </ul>


                <SplitButton pathName={pathname} />


            </div>

            <div className={classes.copyright}>
                Copyright ©ayPromise
            </div>
        </nav>
    )
}

export default Navbar