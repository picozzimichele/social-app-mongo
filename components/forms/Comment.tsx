"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface Props {
    threadId: string;
    currentUserImage: string;
    currentUserId: string;
}

export default function Comment({ threadId, currentUserImage, currentUserId }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        },
    });

    //values are coming directly from reactUseForm
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

        form.reset();
    };

    const testSubmit = () => {
        console.log("test");
    };

    return (
        <Form {...form}>
            <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center gap-3">
                            <FormLabel>
                                <Image
                                    src={currentUserImage}
                                    alt="current_user"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    {...field}
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
    );
}
