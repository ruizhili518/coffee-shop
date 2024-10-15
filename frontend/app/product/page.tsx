"use client";
import {
    MoreHorizontal,
    PlusCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {useRouter} from "next/navigation";
import {deleteProductById, getAllProducts} from "@/api/api";
import React, {useCallback, useEffect, useState} from "react";
import { CldImage } from "next-cloudinary";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Customization, Product} from "@/lib/types";
import LoadingPage from "@/components/LoadingPage";

const ProductPage = () => {
    const router = useRouter();
    // Initialize state to manipulate products data.
    const [products, setProducts] = useState([{
        name:"",
        status:"",
        baseprice:0,
        description:"",
        category:"",
        image:"",
        buy:0,
        getFree:0,
        customizations:[{cusCategory: "", cusName: "", extraprice: 0}],
        _id:"",
        updatedAt: ""
    }]);
    // Group products.
    const [ activeProducts, setActiveProducts ] = useState([{
        name:"",
        status:"",
        baseprice:0,
        description:"",
        category:"",
        image:"",
        buy:0,
        getFree:0,
        customizations:[{cusCategory: "", cusName: "", extraprice: 0}],
        _id:"",
        updatedAt: ""
    }]);
    const [ inactiveProducts, setInactiveProducts ] = useState([{
        name:"",
        status:"",
        baseprice:0,
        description:"",
        category:"",
        image:"",
        buy:0,
        getFree:0,
        customizations:[{cusCategory: "", cusName: "", extraprice: 0}],
        _id:"",
        updatedAt: ""
    }]);
    // State to show if loading.
    const [loading , setLoading] = useState(true);

    // Function to get all products from API.
    const getProducts = async () => {
        try{
            const res = await getAllProducts();
            setProducts(res.data.products);
            setActiveProducts(res.data.products.filter((product: Product) => product.status === "Active"));
            setInactiveProducts(res.data.products.filter((product: Product) => product.status !== "Active"))
            setLoading(false);
        }catch (err){
            console.log('Error in getting products.')
        }
    }

    // Initialize products data while entering the page.
    useEffect(() => {
        getProducts();
    },[])

    // Delete handler.
    const deleteHandler = async (id: string) => {
        try {
            const res = await deleteProductById(id);
            getProducts();
        }catch (err){
            console.log(err);
        }
    }

    // Delete confirm dialog.
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenChange = useCallback((open: boolean) => {
        setDialogOpen(open)
    }, [])

    const handleTriggerClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDialogOpen(true);
    }, [])

    {if(loading)
        return <LoadingPage/>
    }
    return (
        <div className="flex min-h-screen flex-col items-center">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full lg:px-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" className="h-8 gap-1" onClick={() => {router.push("/product/new_product")}}>
                                    <PlusCircle className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Products</CardTitle>
                                    <CardDescription>
                                        Manage your products.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>
                                                    Base Price
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Category
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Customizations
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Promotion
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            { products.map(product => {
                                                    // @ts-ignore
                                                    const uniqueCusCategories: string[] = Array.from(
                                                        new Set<string>(product.customizations.map((customization: Customization) => customization.cusCategory)),
                                                    );
                                                return(
                                                    <TableRow key={product.name}>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <CldImage
                                                                alt="Product image"
                                                                className="aspect-square rounded-md object-contain"
                                                                height="64"
                                                                src={product.image}
                                                                width="64"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {product.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                product.status === "Active" ?
                                                                <Badge variant="outline">{product.status}</Badge> :
                                                                <Badge variant="secondary">{product.status}</Badge>
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            ${product.baseprice}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {product.category}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {
                                                                uniqueCusCategories[0] !== "" ?
                                                                uniqueCusCategories.map((category, index) => (
                                                                    <Badge variant="outline" className="mx-1" key={index}>{category}</Badge>
                                                                    )
                                                                ) :
                                                                    <Badge variant="secondary" className="mx-1">None</Badge>
                                                            }
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {
                                                                product.buy !== 0 && product.getFree !== 0 ?
                                                                    `Buy ${product.buy} get ${product.getFree} free.` :
                                                                    "No Promotion."
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4"/>
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>
                                                                        Actions
                                                                    </DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => {
                                                                        router.push(`/product/${product._id}`)
                                                                    }}>
                                                                        <Button variant="outline" className="h-8 w-28">Edit</Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
                                                                            <AlertDialogTrigger>
                                                                                <Button onClick={handleTriggerClick}
                                                                                        variant="destructive"
                                                                                        className="h-8 w-28"
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>
                                                                                        Are you absolutely sure?
                                                                                    </AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        This action cannot be undone. This will permanently delete the product data from the servers.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <AlertDialogAction onClick={()=> {deleteHandler(product._id)}}>Continue</AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{products.length}</strong>{" "}products
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="active">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Products</CardTitle>
                                    <CardDescription>
                                        Manage your products.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Base Price
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Category
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Customizations
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Promotion
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            { activeProducts.map(product => {
                                                    // @ts-ignore
                                                    const uniqueCusCategories: string[] = Array.from(
                                                        new Set<string>(product.customizations.map((customization: Customization) => customization.cusCategory)),
                                                    );
                                                    return(
                                                        <TableRow key={product.name}>
                                                            <TableCell className="hidden sm:table-cell">
                                                                <CldImage
                                                                    alt="Product image"
                                                                    className="aspect-square rounded-md object-contain"
                                                                    height="64"
                                                                    src={product.image}
                                                                    width="64"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {product.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    product.status === "Active" ?
                                                                        <Badge variant="outline">{product.status}</Badge> :
                                                                        <Badge variant="secondary">{product.status}</Badge>
                                                                }
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                ${product.baseprice}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {product.category}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {
                                                                    uniqueCusCategories[0] !== "" ?
                                                                        uniqueCusCategories.map((category, index) => (
                                                                                <Badge variant="outline" className="mx-1" key={index}>{category}</Badge>
                                                                            )
                                                                        ) :
                                                                        <Badge variant="secondary" className="mx-1">None</Badge>
                                                                }
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {
                                                                    product.buy !== 0 && product.getFree !== 0 ?
                                                                        `Buy ${product.buy} get ${product.getFree} free.` :
                                                                        "No Promotion."
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            aria-haspopup="true"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4"/>
                                                                            <span className="sr-only">Toggle menu</span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>
                                                                            Actions
                                                                        </DropdownMenuLabel>
                                                                        <DropdownMenuItem onClick={() => {
                                                                            router.push(`/product/${product._id}`)
                                                                        }}>
                                                                            <Button variant="outline" className="h-8 w-28">Edit</Button>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
                                                                                <AlertDialogTrigger>
                                                                                    <Button onClick={handleTriggerClick}
                                                                                            variant="destructive"
                                                                                            className="h-8 w-28"
                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                            Are you absolutely sure?
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            This action cannot be undone. This will permanently delete the product data from the servers.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                        <AlertDialogAction onClick={()=> {deleteHandler(product._id)}}>Continue</AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{activeProducts.length}</strong>{" "}
                                        products
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="inactive">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Products</CardTitle>
                                    <CardDescription>
                                        Manage your products.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Base Price
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Category
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Customizations
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Promotion
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            { inactiveProducts.map(product => {
                                                    // @ts-ignore
                                                    const uniqueCusCategories: string[] = Array.from(
                                                        new Set<string>(product.customizations.map((customization: Customization) => customization.cusCategory)),
                                                    );
                                                    return(
                                                        <TableRow key={product.name}>
                                                            <TableCell className="hidden sm:table-cell">
                                                                <CldImage
                                                                    alt="Product image"
                                                                    className="aspect-square rounded-md object-contain"
                                                                    height="64"
                                                                    src={product.image}
                                                                    width="64"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {product.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    product.status === "Active" ?
                                                                        <Badge variant="outline">{product.status}</Badge> :
                                                                        <Badge variant="secondary">{product.status}</Badge>
                                                                }
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                ${product.baseprice}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {product.category}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {
                                                                    uniqueCusCategories[0] !== "" ?
                                                                        uniqueCusCategories.map((category, index) => (
                                                                                <Badge variant="outline" className="mx-1" key={index}>{category}</Badge>
                                                                            )
                                                                        ) :
                                                                        <Badge variant="secondary" className="mx-1">None</Badge>
                                                                }
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {
                                                                    product.buy !== 0 && product.getFree !== 0 ?
                                                                        `Buy ${product.buy} get ${product.getFree} free.` :
                                                                        "No Promotion."
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            aria-haspopup="true"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4"/>
                                                                            <span className="sr-only">Toggle menu</span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>
                                                                            Actions
                                                                        </DropdownMenuLabel>
                                                                        <DropdownMenuItem onClick={() => {
                                                                            router.push(`/product/${product._id}`)
                                                                        }}>
                                                                            <Button variant="outline" className="h-8 w-28">Edit</Button>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
                                                                                <AlertDialogTrigger>
                                                                                    <Button onClick={handleTriggerClick}
                                                                                            variant="destructive"
                                                                                            className="h-8 w-28"
                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                            Are you absolutely sure?
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            This action cannot be undone. This will permanently delete the product data from the servers.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                        <AlertDialogAction onClick={()=> {deleteHandler(product._id)}}>Continue</AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{inactiveProducts.length}</strong>{" "}
                                        products
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default ProductPage;