"use client";
import { Button, buttonVariants } from '@/components/ui/button'
import {
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link from "next/link";
import Image from "next/image";
import {useAppSelector} from "@/lib/store";
import Cookies from 'js-cookie';
import {AuthState} from "@/lib/features/authSlice";
import {getProfile} from "@/api/api";

const refreshToken = Cookies.get('refresh_token');

const getUserInfo = async (values: string) => {
    // let userInfo: AuthState = useAppSelector((state) => state.authReducer.value);
    if(values){
        try {
            const res = await getProfile(values);
            // console.log(res);
        }catch (err){
            console.log(err);
        }
    }
}

const Navbar1 = () => {
    getUserInfo(refreshToken).then();

    return (
        <section className="flex justify-center py-6">
            <div className='container'>
                <nav className='hidden justify-between lg:flex'>
                    <div className='flex items-center gap-6'>
                        <div className='flex items-center gap-2'>
                            <Image src="/cuplogo.jpg" alt="logo" height={25} width={25} />
                            <span className='text-xl font-bold'>
                                Eunnikoo
                            </span>
                        </div>
                        <div className='flex items-center'>
                            <Link
                                className={cn(
                                    'text-muted-foreground',
                                    navigationMenuTriggerStyle,
                                    buttonVariants({
                                        variant: 'ghost',
                                    })
                                )}
                                href='/'
                            >
                                Home
                            </Link>
                            <Link
                                className={cn(
                                    'text-muted-foreground',
                                    navigationMenuTriggerStyle,
                                    buttonVariants({
                                        variant: 'ghost',
                                    })
                                )}
                                href='/'
                            >
                                Menu
                            </Link>
                            <Link
                                className={cn(
                                    'text-muted-foreground',
                                    navigationMenuTriggerStyle,
                                    buttonVariants({
                                        variant: 'ghost',
                                    })
                                )}
                                href='/'
                            >
                                About Us
                            </Link>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Link href="/sign-in">
                        <Button variant={'outline'}>
                                Sign in
                        </Button>
                        </Link>
                        <Link href="/sign-up">
                        <Button>Sign up</Button>
                        </Link>
                    </div>
                </nav>
                <div className='block lg:hidden'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <img
                                src='/cuplogo.jpg'
                                className='w-8'
                                alt='logo'
                            />
                            <span className='text-xl font-bold'>
                                Eunnikoo
                            </span>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant={'outline'} size={'icon'}>
                                    <Menu className='size-4' />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className='overflow-y-auto'>
                                <SheetHeader>
                                    <SheetTitle>
                                        <div className='flex items-center gap-2'>
                                            <img
                                                src='/cuplogo.jpg'
                                                className='w-8'
                                                alt='logo'
                                            />
                                            <span className='text-xl font-bold'>
                                                Eunnikoo
                                            </span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className='mb-8 mt-8 flex flex-col gap-4'>
                                    <Link href='/' className='font-semibold'>
                                        Home
                                    </Link>
                                    <Link href='/' className='font-semibold'>
                                        Menu
                                    </Link>
                                    <Link href='/' className='font-semibold'>
                                        About Us
                                    </Link>
                                </div>
                                <div className='border-t pt-4'>
                                    <div className='mt-2 flex flex-col gap-3'>
                                        <Link href="/sign-in">
                                        <Button variant={'outline'}>
                                            Sign in
                                        </Button>
                                        </Link>
                                        <Link href="/sign-up">
                                            <Button>Sign up</Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Navbar1
