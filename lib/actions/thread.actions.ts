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
    try {
        connectToDB();

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
    try {
        connectToDB();
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
