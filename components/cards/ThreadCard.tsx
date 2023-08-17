import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
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
    isComment,
}: Props) {
    return (
        <article
            className={`flex w-full flex-col rounded-xl ${
                isComment ? "px-0 sm:px-7" : "bg-dark-2 p-7"
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link
                            className="overflow-hidden relative h-11 w-11"
                            href={`/profile/${author.id}`}
                        >
                            <Image
                                src={author.image}
                                alt="Profile Image"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link className="w-fit" href={`/profile/${author.id}`}>
                            <h4 className="cursor-pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>
                        <p className="mt-2 text-small-regular text-light-2">{content}</p>
                        <div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-10"}`}>
                            <div className="flex gap-3.5">
                                <Image
                                    src="/assets/heart-gray.svg"
                                    alt="heart"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain"
                                />
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src="/assets/reply.svg"
                                        alt="reply"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer object-contain"
                                    />
                                </Link>
                                <Image
                                    src="/assets/repost.svg"
                                    alt="repost"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain"
                                />
                                <Image
                                    src="/assets/share.svg"
                                    alt="share"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain"
                                />
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subdle-medium text-gray-1">
                                        {comments.length} replies
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {!isComment && community && (
                <Link className="mt-5 flex items-center" href={`/communities/${community.id}`}>
                    <p className="text-subtle-medium text-gray-1">
                        {formatDateString(createdAt)} - {community.name} Community
                    </p>

                    <Image
                        className="ml-1 rounded-full object-cover"
                        src={community.image}
                        alt="community logo"
                        width={14}
                        height={14}
                    />
                </Link>
            )}
        </article>
    );
}
