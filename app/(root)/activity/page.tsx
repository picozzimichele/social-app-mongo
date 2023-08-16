import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);

    if (userInfo.onboarded === false) {
        redirect("/onboarding");
    }

    //get Activity
    const activity = await getActivity(userInfo._id);

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? <>{activity.map((activity: any) => <Link key={activity._id}></Link>))}</> : <p className="no-result">No Activity yet</p>}
            </section>
        </section>
    );
}
