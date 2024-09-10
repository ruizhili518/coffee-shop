"use client";
import Image from "next/image"
import {
    ChevronLeft,
    PlusCircle,
    Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";

const Page = ({ params }: { params: { manageId: string } }) => {

    // Customization array, add and delete handler.
    const [cusItems, setCusItems] = useState([1]);
    const addHandler = () => {
        const newItem = (cusItems[cusItems.length - 1] ? cusItems[cusItems.length - 1] : 0)  + 1;
        setCusItems(prevState => [...prevState, newItem]);
    }

    const deleteHandler = (event: MouseEvent) => {
        // @ts-ignore
        const btnId = parseInt(event.target.id.match(/\d+$/)[0]); // Get the button id (only in number) and delete it from the array.
        const index = cusItems.indexOf(btnId);
        setCusItems(prevState => [...prevState.slice(0,index),...prevState.slice(index + 1, prevState.length)]);
    }
    // Image array, add and delete handler.

    const [img, setImg] = useState([]);

    return (
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Manage Product
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                        <Button size="sm">Save Product</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        {/*Left three cards.*/}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>
                                    Edit product name and description.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            placeholder="e.g Americano"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="e.g Double espresso, refreshingly invigorating, cooling you all summer."
                                            className="min-h-20"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="baseprice">Base Price</Label>
                                        <Input
                                            id="baseprice"
                                            type="number"
                                            className="w-full"
                                            placeholder="e.g 6.99"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Customization</CardTitle>
                                <CardDescription>
                                    Edit product customization. Enter the customization name and price according to the customization category, and customizations of the same category will be automatically grouped.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        { cusItems.length !== 0 ? cusItems.map(item => {
                                            return(
                                                <TableRow key={item}>
                                                    <TableCell>
                                                        <Label htmlFor={`category${item}`}
                                                               className="sr-only">
                                                            category
                                                        </Label>
                                                        <Input
                                                            id={`category${item}`}
                                                            type="text"
                                                            placeholder="e.g size"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Label htmlFor={`name${item}`} className="sr-only">
                                                            name
                                                        </Label>
                                                        <Input
                                                            id={`name${item}`}
                                                            type="text"
                                                            placeholder="e.g large"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Label htmlFor={`price${item}`} className="sr-only">
                                                            price
                                                        </Label>
                                                        <Input
                                                            id={`price${item}`}
                                                            type="number"
                                                            placeholder="e.g 0.5"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="outline"
                                                                id={`btn${item}`}
                                                                onClick={deleteHandler}>Delete</Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }):
                                            <TableRow>
                                                <TableCell>
                                                Press "Add Variant" to customizations.
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="justify-center border-t p-4">
                                <Button size="sm" variant="ghost" className="gap-1" onClick={addHandler}>
                                    <PlusCircle className="h-3.5 w-3.5"/>
                                    Add Variant
                                </Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <Select>
                                            <SelectTrigger
                                                id="category"
                                                aria-label="Select category"
                                            >
                                                <SelectValue placeholder="Select category"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="drinks">Drinks</SelectItem>
                                                <SelectItem value="food">
                                                    Food
                                                </SelectItem>
                                                <SelectItem value="merchandise">
                                                    Merchandise
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Status</Label>
                                        <Select>
                                            <SelectTrigger id="status" aria-label="Select status">
                                                <SelectValue placeholder="Select status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                                <CardDescription>
                                    Edit product images.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="300"
                                        src="/placeholder.svg"
                                        width="300"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <button>
                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />
                                        </button>
                                        <button>
                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />
                                        </button>
                                        <button
                                            className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                            <Upload className="h-4 w-4 text-muted-foreground"/>
                                            <span className="sr-only">Upload</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Promotion</CardTitle>
                                <CardDescription>Modify promotion for the product. By default there is no promotion.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-1">
                                <CardDescription>Buy</CardDescription>
                                <Label htmlFor={"buy"} className="sr-only">
                                    buy
                                </Label>
                                <Input
                                    id={"buy"}
                                    type="number"
                                    placeholder={"0"}
                                />
                                <CardDescription>get</CardDescription>
                                <Label htmlFor={"get"} className="sr-only">
                                    get
                                </Label>
                                <Input
                                    id={"get"}
                                    type="number"
                                    placeholder={"0"}
                                />
                                <CardDescription>free.</CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button variant="outline" size="sm">
                        Discard
                    </Button>
                    <Button size="sm">Save Product</Button>
                </div>
            </div>
        </div>
    );
};

export default Page;