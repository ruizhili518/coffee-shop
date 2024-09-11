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
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod";

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
    // // Image array, add and delete handler.
    // const [img, setImg] = useState("[]");

    // Form design.
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Product name is required.",
        }),
        description: z.string().min(1,{
            message: "Product description is required.",
        }),
        baseprice: z.number(),
        cusCategory: z.string(),
        cusName: z.string(),
        extraprice: z.number(),
        buy: z.number(),
        get: z.number(),
        status: z.string().min(1, {
            message: "Product status is required."
        }),
        category: z.string().min(1, {
            message: "Product category is required.",
        }),
        image: z.string().min(1,{
            message: "Product image is required.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            baseprice: 0,
            cusCategory: "",
            cusName: "",
            extraprice: 0,
            buy: 0,
            get: 0,
            status: "draft",
            category: "",
            image: ""
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Add New Product
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                        <Button size="sm" type="submit">Save Product</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        {/*Left three cards.*/}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                                <CardDescription>
                                    Edit product name and description.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Name</Label>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            className="w-full"
                                                            placeholder="e.g Americano"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            id="description"
                                                            placeholder="e.g Double espresso, refreshingly invigorating, cooling you all summer."
                                                            className="min-h-20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="baseprice">Base Price</Label>
                                        <FormField
                                            control={form.control}
                                            name="baseprice"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            id="baseprice" type="number" className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Customization</CardTitle>
                                <CardDescription>
                                    Edit product customization. Enter the customization name and price according to the
                                    customization category, and customizations of the same category will be
                                    automatically grouped.
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
                                        {cusItems.length !== 0 ? cusItems.map(item => {
                                                return (
                                                    <TableRow key={item}>
                                                        <TableCell>
                                                            <Label htmlFor={`cusCategory${item}`}
                                                                   className="sr-only">
                                                                category
                                                            </Label>
                                                            <FormField
                                                                control={form.control}
                                                                name="cusCategory"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                id={`cusCategory${item}`}
                                                                                type="text"
                                                                                placeholder="e.g size"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor={`name${item}`} className="sr-only">
                                                                name
                                                            </Label>
                                                            <FormField
                                                                control={form.control}
                                                                name="cusName"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                id={`cusName${item}`}
                                                                                type="text"
                                                                                placeholder="e.g large"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor={`price${item}`} className="sr-only">
                                                                price
                                                            </Label>
                                                            <FormField
                                                                control={form.control}
                                                                name="extraprice"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                id={`extraprice${item}`}
                                                                                type="number"
                                                                                placeholder="e.g 0.5"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="outline"
                                                                    id={`btn${item}`} onClick={deleteHandler}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }) :
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
                                <CardTitle>Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            id="category"
                                                            aria-label="Select category"
                                                        >
                                                            <SelectValue placeholder="Select category"/>
                                                        </SelectTrigger>
                                                    </FormControl>
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
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        {/*Right three cards.*/}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Status</Label>
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger id="status" aria-label="Select status">
                                                                <SelectValue placeholder="Select status"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
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
                                        <button
                                            className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                            <Upload className="h-4 w-4 text-muted-foreground"/>

                                            <span className="sr-only">Upload</span>
                                        </button>
                                        <FormField
                                            control={form.control}
                                            name="image"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            id="image"
                                                            type="text"
                                                            className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Promotion</CardTitle>
                                <CardDescription>Modify promotion for the product. By default there is no
                                    promotion.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-1">
                                <CardDescription>Buy</CardDescription>
                                <Label htmlFor={"buy"} className="sr-only">
                                    buy
                                </Label>
                                <FormField
                                    control={form.control}
                                    name="buy"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="buy"
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <CardDescription>get</CardDescription>
                                <Label htmlFor={"get"} className="sr-only">
                                    get
                                </Label>
                                <FormField
                                    control={form.control}
                                    name="get"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="get"
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
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
                    <Button size="sm" type="submit">Save Product</Button>
                </div>
                </form>
           </Form>
        </div>
    );
};

export default Page;