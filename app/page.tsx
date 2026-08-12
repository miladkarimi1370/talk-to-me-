
import Image from "next/image";

import Link from "next/link";
import { auth } from "./lib/auth";





export default async function HomePage() {
    const session = await auth();

    return (

        <main className="w-screen h-screen  flex justify-center items-center">
          
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className=" p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold text-center mb-6 capitalize">
                        <Image src={"/diagram.svg"} width={800} height={400} alt="logo" className="py-10" />
                        my workspace ai
                    </h1>
                    {session?.user ? (
                        <div className="text-center">
                            <p className="text-success mb-4">


                                Welcome {session.user.name}
                            </p>
                            <Link
                                href="/chat"
                                className="inline-block   px-6 py-2 rounded hover:text-background duration-500 hover:bg-primary-hover"
                            >
                                Enter Chat Room
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="block text-center font-bold px-6 py-2 rounded hover:text-background duration-500 hover:bg-primary-hover"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block text-center font-bold   px-6 py-2 rounded hover:text-background duration-500 hover:bg-primary-hover"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
          
         
        </main>
    );
}