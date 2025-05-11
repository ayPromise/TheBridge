import { Link } from "react-router";
import classes from "../Navbar.module.css";

// redux
import type { RootState } from "store";
import { useSelector } from "react-redux";

interface BookSelectionProps {
    currentPath: string
}

const BookSelection: React.FC<BookSelectionProps> = ({ currentPath }) => {
    const books = useSelector((state: RootState) => state.books.value);
    const pathnameID = Number(currentPath.split("/").pop()) ?? -1;

    return (
        <ul className="flex flex-col gap-[20px]">
            {books.map((book) => (
                <li key={book.id}>
                    <Link to={`book/${book.id}`} className={pathnameID === book.id ? classes.active : ""}>
                        {book.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default BookSelection;
