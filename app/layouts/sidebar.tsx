import { Form, Link, NavLink, Outlet, useFetcher, useFetchers, useNavigation, useSubmit } from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
    const { contacts, q } = loaderData;

    const navigation = useNavigation();

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q]);

    const submit = useSubmit();

    const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

    const favoriteFetcher = useFetcher({ key: "favorite" });

    return (
        <>
            <div id="sidebar">
                <h1>
                    <Link to="about">React Router Contacts</Link>
                </h1>
                <div>
                    <Form
                        onChange={(event) => {
                            const isFirstSearch = q === null;
                            return submit(event.currentTarget, {
                                replace: !isFirstSearch,
                            });
                        }}
                        id="search-form"
                        role="search"
                    >
                        <input className={searching ? "loading" : ""} aria-label="Search contacts" defaultValue={q || ""} id="q" name="q" placeholder="Search" type="search" />
                        <div aria-hidden hidden={!searching} id="search-spinner" />
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={`contacts/${contact.id}`}>
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}
                                        {favoriteFetcher.formData && favoriteFetcher?.data?.id === contact.id ? (
                                            <span>{favoriteFetcher.formData.get("favorite") === "true" ? "★" : ""}</span>
                                        ) : contact.favorite ? (
                                            <span>★</span>
                                        ) : null}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div className={navigation.state === "loading" && !searching ? "loading" : ""} id="detail">
                <Outlet />
            </div>
        </>
    );
}
