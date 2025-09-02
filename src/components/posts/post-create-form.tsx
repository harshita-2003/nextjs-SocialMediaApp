'use client'

import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import FormButton from "../common/form-button";
import { useActionState, startTransition } from "react";
import createPosts from "@/app/actions/create-post";

interface PostCreateFormType {
    slug : string,
}

interface FormState {
    errors: {
        title?: string[];
        content?: string[];
        _form?: string[];
    }
}

export default function PostCreateForm({slug} : PostCreateFormType) {
    const [formState, action, isPending] = useActionState<FormState, FormData>(createPosts.bind(null, slug), {
        errors: {},
    });
    
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        startTransition(() => {
            action(formData);
        });
    }

    return (
        <Popover placement="left">
            <PopoverTrigger>
                <Button color="primary">Create Post</Button>
            </PopoverTrigger>

            <PopoverContent>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-4 p-4 w-80">
                    <h3 className="text-lg">Create a Post</h3>
                    <Input
                        name="title"
                        label="title"
                        labelPlacement="outside"
                        placeholder="Title"
                        isInvalid={!!formState.errors.title}
                        errorMessage={formState.errors.title?.join(", ")}
                    />
                    <Textarea
                        name="content"
                        label="content"
                        labelPlacement="outside"
                        placeholder="Describe your Content"
                        isInvalid={!!formState.errors.content}
                        errorMessage={formState.errors.content?.join(", ")}
                    />
        
                    {formState.errors._form ? <div className="rounded p-2 bg-red-200 border border-red-400">{formState.errors._form?.join(",")}</div> : null}
                    
                    <FormButton isLoading={isPending}>Save</FormButton>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}