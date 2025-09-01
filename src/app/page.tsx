import { Button } from "@nextui-org/react";
import * as action from "./actions"
import { auth } from "@/auth";
import Profile from "@/components/profile"

export default async function Home() {
  const session = await auth();

  console.log("SESSION", session);

  return (
    <div>
      <form action={action.SignIn}>
        <Button type="submit">Sign In with GitHub</Button>
      </form>
      <form action={action.SignOut}>
        <Button type="submit">Sign Out with GitHub</Button>
      </form>


      {
        session?.user? <div>{JSON.stringify(session.user)}</div> : <div>SignedOut</div>
      }

      <Profile />

    </div>
    
  );
}
