import Image from "next/image"
import {ReactNode} from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="w-full flex justify-center min-h-screen lg:grid lg:grid-cols-2">
            <div className="flex justify-center items-center py-12">
                {children}
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/sign.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
