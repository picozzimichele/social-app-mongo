import ThreadCard from "@/components/cards/ThreadCard";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

export default async function Page({ params }: { params: { id: string } }) {
    if (!params.id) return null;
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const thread = await fetchThreadById(params.id);

    return (
        <section className="relative">
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                community={thread.community}
                author={thread.author}
                createdAt={thread.createdAt}
                comments={thread.children}
            />

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((comment: any) => (
                    <ThreadCard
                        key={comment._id}
                        id={comment._id}
                        currentUserId={comment?.id || ""}
                        parentId={comment.parentId}
                        content={comment.text}
                        community={comment.community}
                        author={comment.author}
                        createdAt={comment.createdAt}
                        comments={comment.children}
                        isComment={true}
                    />
                ))}
            </div>
        </section>
    );
}
