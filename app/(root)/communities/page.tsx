import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import Community from "@/lib/models/community.models";
import CommunityCard from "@/components/cards/CommunityCard";

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);

    if (userInfo.onboarded === false) {
        redirect("/onboarding");
    }

    const result = await fetchCommunities({
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
    });
    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            {/* Search Bar */}
            <div className="mt-14 flex flex-col gap-9">
                {result.communities.length === 0 ? (
                    <p className="no-result">No Community yet</p>
                ) : (
                    <>
                        {result.communities.map((comminity) => (
                            <CommunityCard
                                key={comminity.id}
                                id={comminity.id}
                                name={comminity.name}
                                username={comminity.username}
                                imgUrl={comminity.image}
                                bio={comminity.bio}
                                members={comminity.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}
