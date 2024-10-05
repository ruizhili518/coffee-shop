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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const Page = () => {
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
                                    Determine how many points customers get for every $1 spend.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <Input placeholder="Get Points Ratio" defaultValue="/content/plugins"/>
                                </form>
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
                                <form className="flex flex-col gap-4">
                                    <Input
                                        placeholder="Redeem points ratio"
                                        defaultValue="/content/plugins"
                                    />
                                </form>
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
