"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
}: {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}): Promise<void> {
    connectToDB();
    try {
        await User.findOneAndUpdate(
            { id: userId },
            { username: username.toLowerCase(), name, bio, image, path },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (err: any) {
        throw new Error(`Error updating user: ${err.message}`);
    }
}
