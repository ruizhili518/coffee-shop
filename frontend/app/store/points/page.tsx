'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {getGetPointRatio, getRedeemPointRatio, manageGetPointsRatio, manageRedeemPointsRatio} from "@/api/api";
import {useEffect, useState} from "react";
import LoadingPage from "@/components/LoadingPage";

const Page = () => {
    const [getRatio, setGetRatio] = useState(0);
    const [redeemRatio, setRedeemRatio] = useState(0);
    const [loading, setLoading] = useState(true);

    // Function to get initial values.
    const getInitialRatio = async () =>{
        try{
            const getRes = await getGetPointRatio();
            const redeemRes = await getRedeemPointRatio();
            setGetRatio(getRes.data.ratio.ratio);
            setRedeemRatio(redeemRes.data.ratio.ratio);
            setLoading(false);
        }catch (e){
            console.log(e);
        }
    };

    // Handler to manage all changes.
    const manageGetRatioHandler = async () => {
        try {
            await manageGetPointsRatio({getRatio});
        }catch (e){
            console.log(e);
        }
    }
    const manageRedeemRatioHandler = async () => {
        try {
            await manageRedeemPointsRatio({redeemRatio});
        }catch (e){
            console.log(e);
        }
    }

    // Initial call when open the page.
    useEffect(() => {
        getInitialRatio();
    }, []);

    if(loading){
        return <LoadingPage/>
    }
    return (
        <div className="flex min-h-[calc(90vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">Store settings</h1>
            </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <div className="grid gap-4 text-sm text-muted-foreground">
                        <Link href={"/store/coupons"} >
                            Coupons
                        </Link>
                        <Link href={"/store/points"} className="font-semibold text-primary">Points</Link>
                    </div>
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Get points ratio</CardTitle>
                                <CardDescription>
                                    Determine how many points customers get for every $1 spend. (1 $ = {getRatio} points)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input placeholder="Get Points Ratio" defaultValue={getRatio} onChange={(e) => {
                                    setGetRatio(Number(e.target.value))
                                }}/>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={manageGetRatioHandler}>Save</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Redeem points ratio</CardTitle>
                                <CardDescription>
                                    Determine how many dollars each point can be redeemed for. (1 point = {redeemRatio} $)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="Redeem points ratio"
                                    defaultValue={redeemRatio}
                                    onChange={(e) => {
                                        setRedeemRatio(Number(e.target.value))
                                    }}
                                />
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={manageRedeemRatioHandler}>Save</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
        </div>
    )
};

export default Page;
