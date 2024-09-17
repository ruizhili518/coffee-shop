"use client";
import Image from "next/image"
import {
    ListFilter,
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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import {getAllProducts} from "@/api/api";
import {useEffect, useState} from "react";
import Loading from "@/components/ui/Loading";
import { CldImage } from "next-cloudinary";

const ProductPage = () => {
    type Customization = {
        cusCategory: string,
        cusName: string,
        extraprice: number
    }

    const router = useRouter();
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
    const [loading , setLoading] = useState(true);

    const getProducts = async () => {
        try{
            const res = await getAllProducts();
            setProducts(res.data.products);
            setLoading(false);
        }catch (err){
            console.log('Error in getting products.')
        }
    }

    useEffect(() => {
        getProducts();
    },[])

    return (
        <div className="flex min-h-screen flex-col items-center">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full lg:px-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="draft">Inactive</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 gap-1">
                                            <ListFilter className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuCheckboxItem checked>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Inactive
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                                            { !loading ? products.map(product => {
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
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => {
                                                                        router.push("/product/lemonade")
                                                                    }}>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }) :
                                                <TableRow>
                                                    <TableCell colSpan={8} className="w-full">
                                                        <Loading/>
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{products.length > 10 ? '1-10' : `1-${products.length}`}</strong> of <strong>{products.length}</strong>{" "}
                                        products
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
                                                    Price
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Total Sales
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Created at
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src="/placeholder.svg"
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    Laser Lemonade Machine
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    $499.99
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    25
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2023-07-12 10:42 AM
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
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => {
                                                                router.push("/product/lemonade")
                                                            }}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src="/placeholder.svg"
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    Hypernova Headphones
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Active</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    $129.99
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    100
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2023-10-18 03:21 PM
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
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src="/placeholder.svg"
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    AeroGlow Desk Lamp
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Active</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    $39.99
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    50
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2023-11-29 08:15 AM
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
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src="/placeholder.svg"
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    TechTonic Energy Drink
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">Draft</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    $2.99
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    0
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2023-12-25 11:59 PM
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
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src="/placeholder.svg"
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    Gamer Gear Pro Controller
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Active</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    $59.99
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    75
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2024-01-01 12:00 AM
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
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src="/placeholder.svg"
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    Luminous VR Headset
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Active</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    $199.99
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    30
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2024-02-14 02:14 PM
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
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
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