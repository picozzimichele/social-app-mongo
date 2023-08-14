import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);

    if (userInfo?.onboarded === false) {
        redirect("/onboarding");
    }

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread user={userInfo} btnTitle="fantastic" />
        </>
    );
}
