import type { Route } from "./+types/_index";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function BooksPage() {
    return <div className="text-white">Login</div>;
}
