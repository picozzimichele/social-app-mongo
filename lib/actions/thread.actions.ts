"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}

export async function createThread({ text, author, communityId, path }: Params) {
    connectToDB();
    try {
        const createdThread = await Thread.create({
            text,
            author,
            //TODO implement communities
            community: null,
        });

        //Update user model
        await User.findByIdAndUpdate(author, { $push: { threads: createdThread._id } });

        //this way it updated immediately in the FE
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`failed to create a thread: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();
    try {
        //Caluculate posts to skip depending on page number
        const skipAmount = (pageNumber - 1) * pageSize;

        //Fetch posts that have no patents, top level posts only
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
            })
            .populate({
                path: "children", // Populate the children field
                populate: {
                    path: "author", // Populate the author field within children
                    model: User,
                    select: "_id name parentId image", // Select only _id and username fields of the author
                },
            });

        const totalPostCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] },
        });

        const posts = await postsQuery.exec();

        const isNext = totalPostCount > skipAmount + posts.length;

        return { posts, isNext };
    } catch (error: any) {}
}

export async function fetchThreadById(threadId: string) {
    connectToDB();
    try {
        //TODO populate communities
        const thread = await Thread.findById(threadId)
            .populate({
                path: "author",
                model: User,
                select: "_id id name image",
            })
            .populate([
                {
                    path: "children", // Populate the children field
                    populate: {
                        path: "author", // Populate the author field within children
                        model: User,
                        select: "_id id parentId name image", // Select only _id and username fields of the author
                    },
                },
                {
                    path: "children", // Populate the children field
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "_id id parentId name image",
                    },
                },
            ])
            .exec();

        return thread;
    } catch (error: any) {
        throw new Error(`failed to fetch thread: ${error.message}`);
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB();
    try {
        //find original thread by id
        const originalThread = await Thread.findById(threadId);

        if (!originalThread) {
            throw new Error("thread not found");
        }

        //create new comment
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        });

        //save comment
        const savedCommentThread = await commentThread.save();

        //update the original thread with the new comment
        originalThread.children.push(savedCommentThread._id);

        //save original thread
        await originalThread.save();

        //this way it updated immediately in the FE
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`failed to add comment to thread: ${error.message}`);
    }
}
