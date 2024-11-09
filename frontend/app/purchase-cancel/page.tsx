'use client';

import React from 'react';
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <div className="mb-4 flex justify-center items-center gap-4">
                        <XCircle className="h-12 w-12 text-destructive"/>
                        <h1 className="text-2xl font-bold">Purchase Failed!</h1>
                    </div>

                    <p className="text-muted-foreground mb-6">
                        It looks like you did not complete the payment. Never mind, take your time!
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" variant="default" onClick={() => router.push("/menu")}>
                        Continue Shopping
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Page;