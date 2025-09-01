'use client'

import {
    NavbarItem, Button, Avatar, Popover, PopoverTrigger, PopoverContent
} from '@nextui-org/react'
import { useSession } from 'next-auth/react';
import * as action from '@/app/actions'


export default function HeaderAuth() {
    const session = useSession();

    let authContent: React.ReactNode;
    if(session.status === "loading"){
        authContent = "loading"
    }
    else if(session?.data?.user) {
        authContent = <Popover placement='right'>
                <PopoverTrigger>
                    <Avatar src={session.data.user.image || "" }/>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="p-4">
                        <form action={action.SignOut}>
                            <Button type='submit'>Sign Out</Button>
                        </form>
                    </div>
                </PopoverContent>
            </Popover>
    }else {
        authContent = <>
            <NavbarItem>
                <form action={action.SignIn}>
                    <Button type='submit' color='secondary' variant='bordered'>Sign In</Button>
                </form>
                
            </NavbarItem>

            <NavbarItem>
                <form action={action.SignOut}>
                    <Button type='submit' color='primary' variant='flat'>Sign Up</Button>
                </form>
                
            </NavbarItem>
        </>
    }


    return authContent;
}