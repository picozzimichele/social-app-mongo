import React from "react";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    community: { id: string; name: string; image: string } | null;
    author: { name: string; image: string; id: string };
    createdAt: string;
    comments: {
        author: { image: string };
    }[];
    isComment?: boolean;
}

export default function ThreadCard({
    id,
    currentUserId,
    parentId,
    content,
    community,
    author,
    createdAt,
    comments,
}: Props) {
    return (
        <article>
            <h2 className="text-small-regular text-light-2">{content}</h2>
        </article>
    );
}
