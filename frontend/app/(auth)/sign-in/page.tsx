"use client";
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button, buttonVariants} from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import {Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { signIn } from "@/api/api";
import { useRouter } from "next/navigation";
import {cn} from "@/lib/utils";
import {navigationMenuTriggerStyle} from "@/components/ui/navigation-menu";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {AuthState, signInAuth} from "@/lib/features/authSlice";

const SignInPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [displayErr, setDisplayErr] = useState("hidden"); // Set if the error message shown on the page.
    const [errMessage, setErrMessage] = useState("Invalid username or password. Please log in again.")

    const router = useRouter(); // Use to navigate to other page.

    const FormSchema = z.object({
        username: z.string().min(1, {
            message: "Username must be at least 1 characters.",
        }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        })
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try{
            const res = await signIn(values);
            const userInfo: AuthState = {
                username: res.data.user.username,
                userId: res.data.user.userId,
                coupons : res.data.user.coupons,
                customerName : res.data.user.customerName,
                orderHistory: res.data.user.orderHistory,
                email : res.data.user.email,
                points : res.data.user.points,
                role: res.data.user.role,
            } // Store the user information.

            dispatch(signInAuth(userInfo));
            setDisplayErr('hidden'); //Hide the error message.
            router.push('/');
        }catch (err: any){
            if(err.status ===401){
                setDisplayErr('block'); //Display the error message.
            }else{
                setErrMessage("Something went wrong with the server. Please try again later.");
                setDisplayErr("block");
            }
        }
    }

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-balance text-muted-foreground">
                    Use username and password to sign in.
                </p>
            </div>
            {/*Form*/}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline">
                    Sign up
                </Link>
            </div>
            <Alert variant="destructive" className={displayErr} >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {errMessage}
                </AlertDescription>
            </Alert>
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
                &lt;&ndash;&nbsp;Back Home
            </Link>
        </div>
    );
};

export default SignInPage;