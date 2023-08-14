import { fetchPosts } from "@/lib/actions/thread.actions";

export default async function Home() {
    const result = await fetchPosts();
    return (
        <>
            <h1 className="head-text text-left">Home</h1>
        </>
    );
}
