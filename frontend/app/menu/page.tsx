'use client';
import React, {useEffect, useState} from 'react';
import {getAllProducts} from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {Separator} from "@/components/ui/separator";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {addItem, ItemState} from "@/lib/features/cartSlice";

const MenuPage = () => {
    type Customization = {
        cusCategory: string,
        cusName: string,
        extraprice: number
    }
    type Product = {
        name:string,
        status:string,
        baseprice:number,
        description:string,
        category:string,
        image:string,
        buy:number,
        getFree:number,
        customizations:Customization[],
        _id:string,
        updatedAt: string
    }

    // Initialize state to get products data.
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
    const [isLoading, setIsLoading] = useState(true);
    const getProducts = async () => {
        try{
            const res = await getAllProducts();
            const activeProduct = res.data.products.filter((product:Product) => product.status === "Active")
            setIsLoading(false);
            setProducts(activeProduct);
        }catch (err){
            console.log('Error in getting products.')
        }
    }
    useEffect(() => {
        getProducts();
    },[]);

    // Create variables to realise filter function.
    const categories = ["Drinks", "Food", "Merchandise"];
    const [sortBy, setSortBy] = useState("default");
    const [showBy, setShowBy] = useState("default");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [productPrice, setProductPrice] = useState(0);
    useEffect(() => {
        let result = products
        // Apply search filter
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        // Apply category filter
        if (selectedCategories.length > 0) {
            result = result.filter(product => selectedCategories.includes(product.category))
        }
        // Apply sorting
        if (sortBy === "default"){
            result = [...result];
        }else if (sortBy === "price-low-high") {
            result = [...result].sort((a, b) => a.baseprice - b.baseprice);
        } else if (sortBy === "price-high-low") {
            result = [...result].sort((a, b) => b.baseprice - a.baseprice);
        }

        if (showBy === "default"){
            result = [...result];
        }else if(showBy === "sale"){
            result = result.filter(product => (product.buy !== 0));
        }

        setFilteredProducts(result)
    }, [products,searchTerm, selectedCategories, sortBy, showBy]);

    //States to get customization details.
    const [selectedSize, setSelectedSize] = useState("Regular");
    const [selectedIce, setSelectedIce] = useState("Normal Ice");
    const [selectedMilk, setSelectedMilk] = useState("Normal Milk");
    const [quantity, setQuantity] = useState(1);
    const initializeHandler = () => {
        setSelectedSize("Regular");
        setSelectedIce("Normal Ice");
        setSelectedMilk("Normal Milk");
        setQuantity(1);
    };

    // Add to cart function.
    const dispatch = useDispatch<AppDispatch>();
    const getPrice = (product: Product , selectedName: string) => {
        return product.customizations.length === 0 ? 0 : (product.customizations.filter(cus => cus.cusName === selectedName)[0] ? product.customizations.filter(cus => cus.cusName === selectedName)[0].extraprice : 0);
    } // Return the customization price based on user's choice.
    const getDiscount = (product: Product , amount: number) => {
        if(amount <= product.buy) return amount;
        const free = Math.floor(amount / (product.buy + product.getFree));
        return (amount - free);
    } // Return the number of the items user need to pay based on buy and getFree.
    const addCartHandler = (product: Product) => {
        const sizePrice = getPrice(product, selectedSize);
        const milkPrice= getPrice(product, selectedMilk);
        const icePrice = getPrice(product,selectedIce);
        const time = Date.now();
        const item: ItemState = {
            time: time,
            name: product.name,
            size: selectedSize,
            sizePrice: sizePrice,
            milk: selectedMilk,
            milkPrice: milkPrice,
            ice: selectedIce,
            icePrice: icePrice,
            amount: quantity,
            price: product.buy === 0 ? ((product.baseprice + sizePrice + milkPrice + icePrice) * quantity) : ((product.baseprice + sizePrice + milkPrice + icePrice) * getDiscount(product,quantity)),
            image:product.image
        }
        dispatch(addItem(item));
    }

    return (
        <div className="container mx-auto p-4 lg:w-3/4">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                    <div className="p-4 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="Search Product/Category"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Category</h3>
                            {categories.map(category => (
                                <div key={category} className="flex items-center mb-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={(checked) => {
                                            setSelectedCategories(
                                                checked
                                                    ? [...selectedCategories, category]
                                                    : selectedCategories.filter((c) => c !== category)
                                            )
                                        }}
                                    />
                                    <label htmlFor={category} className="ml-2">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Sort</h3>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sort by"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Show</h3>
                            <Select value={showBy} onValueChange={setShowBy}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Show by"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="sale">On Sale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="hidden md:block mt-6 p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-2">Top sellers</h3>
                        {!isLoading ?
                            products.slice(0, 4).map(product => (
                                <div key={product._id} className="flex items-center mb-4">
                                    <img src={product.image} alt={product.name}
                                         className="w-16 h-16 object-cover rounded-md mr-4"/>
                                    <div>
                                        <h4 className="font-semibold">{product.name}</h4>
                                        <span className="text-sm">${product.baseprice.toFixed(2)}</span>
                                    </div>
                                </div>
                            )) :
                            <div className="flex w-full justify-center">
                                <Loading/>
                            </div>}
                    </div>
                </div>
                <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!isLoading ?
                        filteredProducts.map(product => {
                            const uniqueCusCategories: string[] = Array.from(
                                new Set<string>(product.customizations.map((customization: Customization) => customization.cusCategory)),
                            );
                            const sizeCus = product.customizations.filter(cus => cus.cusCategory === "Size");
                            const iceCus = product.customizations.filter(cus => cus.cusCategory === "Ice");
                            const milkCus = product.customizations.filter(cus => cus.cusCategory === "Milk");
                            return (<Card key={product._id} className="max-h-fit">
                                <CardContent className="p-4">
                                    <Image src={product.image} alt={product.name} width="120" height="120"
                                           className="aspect-square w-full rounded-md object-contain mb-2"/>
                                    <div className="flex-col">
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm font-semibold">{product.name}</div>
                                            <span className="text-lg font-bold">
                                                ${product.baseprice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 mt-2">
                                            {
                                                uniqueCusCategories[0] !== "" &&
                                                    uniqueCusCategories.map((category, index) => (
                                                        <Badge variant="outline" key={index}>
                                                            <div className="hidden lg:block">
                                                                {category}
                                                            </div>
                                                            <Image src={`/${category}.png`} alt="icon" height="20" width="20"/>
                                                        </Badge>
                                                    ))
                                            }
                                            {
                                                (product.buy !== 0 && product.getFree !== 0) &&
                                                <Badge variant="secondary">
                                                    Buy {product.buy} get {product.getFree} free
                                                </Badge>
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-2">
                                    <Sheet>
                                        <SheetTrigger className="w-full">
                                            <Button className="w-full" variant="outline" onClick={initializeHandler}>{/*Initialize the selected cus.*/}
                                                Add to Cart
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <ScrollArea className="h-[calc(100vh-3rem)]">
                                                <SheetHeader className="my-4 flex-col">
                                                    <Image src={product.image} alt={product.name} width={300}
                                                           height={300} className="self-center"/>
                                                    <SheetTitle>{product.name}</SheetTitle>
                                                    <SheetDescription>
                                                        {product.description}
                                                    </SheetDescription>
                                                </SheetHeader>
                                                <Separator/>
                                                <SheetHeader className="mt-4 flex-col">
                                                    <SheetTitle>
                                                        {uniqueCusCategories[0] !== "" && "Customization:"}
                                                    </SheetTitle>
                                                    {
                                                        uniqueCusCategories[0] !== "" &&
                                                        uniqueCusCategories.map((category, index) => (
                                                            <SheetDescription className="flex-col">
                                                                <Badge className="flex w-16 justify-center mb-4"
                                                                       variant="outline">
                                                                    {category}
                                                                    <Image src={`/${category}.png`} alt="icon"
                                                                           height="20" width="20"/>
                                                                </Badge>
                                                                {category === "Size" && sizeCus.length !== 0 &&
                                                                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize} defaultValue={sizeCus[0].cusName}
                                                                    >
                                                                        <div
                                                                            className="grid grid-col-1 md:grid-cols-2 gap-2 mb-2">
                                                                            {sizeCus.map(customization => {
                                                                                return (
                                                                                    <div
                                                                                        className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value={customization.cusName}
                                                                                            id={customization.cusName}/>
                                                                                        <Label
                                                                                            htmlFor={customization.cusName}>
                                                                                            {customization.cusName} &nbsp;
                                                                                            ${customization.extraprice}
                                                                                        </Label>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </RadioGroup>
                                                                }
                                                                {category === "Ice" &&
                                                                    <RadioGroup value={selectedIce}
                                                                                onValueChange={setSelectedIce}
                                                                                defaultValue={iceCus[0].cusName}
                                                                    >
                                                                        <div
                                                                            className="grid grid-col-1 md:grid-cols-2 gap-2 mb-2">
                                                                            {iceCus.map(customization => {
                                                                                return (
                                                                                    <div
                                                                                        className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value={customization.cusName}
                                                                                            id={customization.cusName}/>
                                                                                        <Label
                                                                                            htmlFor={customization.cusName}>
                                                                                            {customization.cusName} &nbsp;
                                                                                            ${customization.extraprice}
                                                                                        </Label>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </RadioGroup>
                                                                }
                                                                {category === "Milk" && milkCus.length !== 0 &&
                                                                    <RadioGroup value={selectedMilk}
                                                                                onValueChange={setSelectedMilk}
                                                                                defaultValue={milkCus[0].cusName}
                                                                    >
                                                                        <div
                                                                            className="grid grid-col-1 md:grid-cols-2 gap-2 mb-2">
                                                                            {milkCus.map(customization => {
                                                                                return (
                                                                                    <div
                                                                                        className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value={customization.cusName}
                                                                                            id={customization.cusName}/>
                                                                                        <Label
                                                                                            htmlFor={customization.cusName}>
                                                                                            {customization.cusName} &nbsp;
                                                                                            ${customization.extraprice}
                                                                                        </Label>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </RadioGroup>
                                                                }
                                                            </SheetDescription>
                                                        ))}
                                                </SheetHeader>
                                                <div className="flex items-center justify-between w-3/4 mt-4">
                                                    <div className="flex items-center space-x-4">
                                                        <Button variant="outline" size="icon" className="rounded-full text-xl"
                                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                                            -
                                                        </Button>
                                                        <span>{quantity}</span>
                                                        <Button variant="outline" size="icon" className="rounded-full text-xl"
                                                                onClick={() => setQuantity(quantity + 1)}>
                                                            +
                                                        </Button>
                                                    </div>
                                                    <div className="text-2xl font-bold">
                                                        ${product.buy === 0 ?
                                                            (((product?.baseprice || 0) + (getPrice(product,selectedIce)) + (getPrice(product, selectedSize)) + (getPrice(product, selectedMilk)) )* quantity).toFixed(2) : (
                                                                ((product?.baseprice || 0) + (getPrice(product,selectedIce)) + (getPrice(product, selectedSize)) + (getPrice(product, selectedMilk))) * getDiscount(product,quantity)
                                                            ).toFixed(2)
                                                        }
                                                    </div>
                                                </div>
                                                <SheetFooter>
                                                    <SheetClose asChild>
                                                    <Button className="w-full mt-4" variant="outline" onClick={() => {
                                                        addCartHandler(product);
                                                    }}>
                                                        Add to Cart
                                                    </Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                </CardFooter>
                                </Card>
                            )
                        }) :
                        <div className="flex w-full justify-center">
                            <Loading/>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default MenuPage;