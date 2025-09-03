'use server'

import { redirect } from "next/navigation"

export default async function Search(formData : FormData) {
    const term = await formData.get("term")

    if(!term || typeof term !== 'string') {
        redirect('/')
    }

    redirect(`/search?term=${term}`)
}