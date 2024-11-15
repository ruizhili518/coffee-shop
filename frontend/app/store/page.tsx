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
import {toast} from "sonner";

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
            toast.success(`Get points ratio set to ${getRatio}.`)
        }catch (e){
            console.log(e);
        }
    }
    const manageRedeemRatioHandler = async () => {
        try {
            await manageRedeemPointsRatio({redeemRatio});
            toast.success(`Redeem points ratio set to ${redeemRatio}.`)
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
        <div className="flex-col items-start gap-6 mx-auto w-10/12">
            <div className="my-4 text-2xl font-bold">
                Points Settings
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
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
                        placeholder="Redeem points ratio" defaultValue={redeemRatio} onChange={(e) => {
                            setRedeemRatio(Number(e.target.value))
                        }}/>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={manageRedeemRatioHandler}>Save</Button>
                </CardFooter>
            </Card>
            </div>
        </div>
    )
};

export default Page;
