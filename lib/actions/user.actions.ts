"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.models";
import page from "@/app/(auth)/onboarding/page";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function fetchUsers({
    userId,
    pageNumber = 1,
    pageSize = 20,
    searchString = "",
    sortBy = "desc",
}: {
    userId: string;
    pageNumber?: number;
    pageSize?: number;
    searchString?: string;
    sortBy?: SortOrder;
}) {
    connectToDB();
    try {
        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            //filter out our current user
            id: { $ne: userId },
        };

        if (searchString.trim() !== "") {
            query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
        }

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > pageNumber + users.length;

        return { users, isNext };
    } catch (err: any) {
        throw new Error(`Error fetching users: ${err.message}`);
    }
}
