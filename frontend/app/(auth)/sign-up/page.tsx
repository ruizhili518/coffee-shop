"use client";

import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button, buttonVariants} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {cn} from "@/lib/utils";
import {navigationMenuTriggerStyle} from "@/components/ui/navigation-menu";
import {signUp} from "@/api/api";
import {promises} from "node:dns";


function AlertCircle(props: { className: string }) {
    return null;
}

const SignUpPage = () => {
    const [displayErr, setDisplayErr] = useState("hidden");
    const [errMessage, setErrMessage] = useState("User already exists, please try to sign in or use another username.");
    const [displaySuc, setDisplaySuc] = useState("hidden");
        // Set if the error or successful message shown on the page.

    const router = useRouter(); // Use to navigate to other page.

    const FormSchema = z.object({
        username: z.string().min(1, {
            message: "Username is required.",
        }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
        email: z.string().email(),
        customerName: z.string().min(1, {
            message: "Preferred name is required.",
        })
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            customerName: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
            setDisplaySuc("hidden");
            setDisplayErr("hidden");
        try{
            const res = await signUp(values);
            setDisplaySuc("block");
            setTimeout(() => {
                router.push("/sign-in");
            },2000);
        }catch(err: any){
            if(err.status === 400){
                setDisplayErr("block");
            }else if(err.status === 401){
                setErrMessage("Email already exists, please try to sign in or use another email");
                setDisplayErr("block");
            }
            else{
                setErrMessage("Something went wrong with the server. Please try again.");
                setDisplayErr("block");
            }
        }
    }

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-balance text-muted-foreground">
                    Finish sign-up in 2 minutes.
                </p>
            </div>
            {/*Form*/}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <FormField
                        control={form.control}
                        name="customerName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Preferred Name</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline">
                    Sign In
                </Link>
            </div>
            <Alert className={displaySuc}>
                <AlertTitle>Sign up successfully!</AlertTitle>
                <AlertDescription>
                    You will be redirected to the sign in page.
                </AlertDescription>
            </Alert>
            <Alert variant="destructive" className={displayErr}>
                <AlertCircle className="h-4 w-4"/>
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

export default SignUpPage;