'use server'

import * as auth from "@/auth"

export async function SignIn() {
    await auth.signIn("github")
}