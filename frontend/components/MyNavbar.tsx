"use client";
import { Button, buttonVariants } from '@/components/ui/button';
import {
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import {CircleUser, Menu} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {AuthState, signInAuth, signOutAuth} from "@/lib/features/authSlice";
import {getProfile, signOut} from "@/api/api";
import {useEffect, useState} from "react";
import Cart from "@/components/Cart";
import {useDispatch} from "react-redux";

const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Get the user information if signed in and use store in redux slice.
    const getUserInfo = async () => {
        try {
            const res = await getProfile();
            if(res.data.user){
                const userInfo : AuthState = {
                    username: res.data.user.username,
                    userId: res.data.user.userId,
                    customerName : res.data.user.customerName,
                    orderHistory: res.data.user.orderHistory,
                    email : res.data.user.email,
                    points : res.data.user.points,
                    role: res.data.user.role,
                }
                dispatch(signInAuth(userInfo));
            }
        }catch (err){
            console.log('No user', err);
        }
    }

    // Get user from redux.
    let userInformation = useAppSelector((state) => state.authReducer.value);

    //Set menu content and initial state of the menu.
    const userMenu = [
        [ "/" , "Home"], [ "/menu", "Menu"]
    ];
    const adminMenu = [
        [ "/" , "Home"], [ "/menu", "Menu"] , [ "/" , "Order History" ]
    ];
    const superAdminMenu = [
        [ "/" , "Home"], [ "/menu", "Menu"] , [ "/order-history" , "All Orders" ], [ "/product" , "Manage Product" ] , [ "/store", "Manage Store"]
    ];

    const [menu, setMenu] = useState(userMenu);

    // Use to control if the modal shown on the page.
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };

    // Sign out handler.
    const signOutHandler = async () => {
        try{
            await signOut();
            dispatch(signOutAuth());
            toggleModal()
            router.push("/");
        }catch(err){
            console.log(err);
        }
    };

    // Initialization of the navbar.
    useEffect(()=> {
        getUserInfo();
    }, []);

    // Refresh menu item when userInformation changed.
    useEffect(()=> {
        if(userInformation.role === "ROLE_VISITOR" || userInformation.role === "ROLE_USER"){
            setMenu(userMenu);
        }else if(userInformation.role === "ROLE_ADMIN"){
            setMenu(adminMenu);
        }else{
            setMenu(superAdminMenu);
        }
    },[userInformation]);

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
                            {
                                (menu.map((item) => {
                                    return(
                                        <Link
                                            className={cn('text-muted-foreground', navigationMenuTriggerStyle,
                                                buttonVariants({
                                                    variant: 'ghost',
                                                })
                                            )}
                                            href={item[0]}
                                            key={item[1]}
                                        >
                                            {item[1]}
                                        </Link>
                                    )
                                }))
                            }
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Cart/>
                        { userInformation.role !== 'ROLE_VISITOR' ?
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hi! {userInformation.customerName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/order-history")}>
                                    Order History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    My Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={toggleModal}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> :
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
                        }
                    </div>
                </nav>
                <div className='block lg:hidden px-4'>
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
                        <div className="flex gap-2">
                            <Cart/>
                        { userInformation.role !== "ROLE_VISITOR" &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hi! {userInformation.customerName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/order-history")}>Order History</DropdownMenuItem>
                                <DropdownMenuItem>My Account</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={toggleModal}>Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        }
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
                                    {menu.map(item => {
                                        return (
                                            <Link href={item[0]} className='font-semibold' key={item[1]}
                                            >
                                                {item[1]}
                                            </Link>
                                        )
                                    })}
                                </div>
                                { userInformation.role === "ROLE_VISITOR" &&
                                <div className='border-t pt-4'>
                                    <div className='mt-2 flex gap-3'>
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
                                }
                            </SheetContent>
                        </Sheet>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog open={modal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure to sign out?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={toggleModal}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={signOutHandler}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    )
}

export default Navbar
