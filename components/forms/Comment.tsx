"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
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
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {};

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                {/* Name */}
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel>
                                <Image
                                    src={currentUserImage}
                                    alt="profile"
                                    width={48}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    className="no-focus text-light-1 outline-none"
                                    type="text"
                                    placeholder="Comment..."
                                    {...field}
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
