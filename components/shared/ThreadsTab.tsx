import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

export default async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
    let result = await fetchUserThreads(accountId);
    if (!result) redirect("/");
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    community={thread.community}
                    author={thread.author}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
}
