'use server'

import * as auth from "@/auth"

export async function SignOut() {
    await auth.signOut()
}