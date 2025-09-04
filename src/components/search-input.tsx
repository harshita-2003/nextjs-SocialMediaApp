'use client'

import Search from "@/app/actions/search";
import { Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

export default function SearchInput() {

    const searchParams = useSearchParams();
    
    return(
        <form action={Search}>
            <Input name="term" defaultValue={searchParams.get('term') || ""} placeholder="Search" />
        </form>
    ) 
}