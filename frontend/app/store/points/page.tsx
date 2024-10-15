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
import {getGetPointRatio} from "@/api/api";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {finishLoading} from "@/lib/features/loadingSlice";

const Page = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [getRatio, setGetRatio] = useState(0);
    const [redeemRatio, setRedeemRatio] = useState(0);

    const getPointsRatio = async () =>{
        try{
            const res = await getGetPointRatio();
            const value = res.data.ratio.ratio;
            setGetRatio(value);
        }catch (e){
            console.log(e);
        }
    };

    useEffect(() => {
        getPointsRatio();
    }, []);

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
                                <Input placeholder="Get Points Ratio" defaultValue={getRatio}/>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Redeem points ratio</CardTitle>
                                <CardDescription>
                                    Determine how many dollars each point can be redeemed for.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="Redeem points ratio"
                                    defaultValue="/content/plugins"
                                />
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
        </div>
    )
};

export default Page;
