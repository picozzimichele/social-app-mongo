"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.models";

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
    onboarded,
}: {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
    onboarded: boolean;
}): Promise<void> {
    connectToDB();
    try {
        await User.findOneAndUpdate(
            { id: userId },
            { username: username.toLowerCase(), name, bio, image, path, onboarded },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (err: any) {
        throw new Error(`Error updating user: ${err.message}`);
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User.findOne({ id: userId });
        // .populate({
        //     path: "communities",
        //     model: "Community",
        // });
    } catch (err: any) {
        throw new Error(`Error fetching user: ${err.message}`);
    }
}

export async function fetchUserThreads(userId: string) {
    connectToDB();
    try {
        const threads = await User.findOne({ id: userId }).populate({
            path: "threads",
            model: Thread,
            populate: {
                path: "children",
                model: Thread,
                populate: {
                    path: "author",
                    model: User,
                    select: "id name image",
                },
            },
        });

        return threads;
    } catch (err: any) {
        throw new Error(`Error fetching user threads: ${err.message}`);
    }
}
