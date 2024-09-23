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
import { GiIceCube } from "react-icons/gi";

const MenuPage = () => {
    type Customization = {
        cusCategory: string,
        cusName: string,
        extraprice: number
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
            setIsLoading(false);
            setProducts(res.data.products);
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
                            return (<Card key={product._id} className="h-96">
                                <CardContent className="p-4">
                                    <Image src={product.image} alt={product.name} width="120" height="120"
                                           className="aspect-square w-full rounded-md object-contain"/>
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
                                                            <Badge variant="outline" key={index}>{category}</Badge>
                                                        )
                                                    )
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
                                    <Button className="w-full" variant="outline">Add to Cart</Button>
                                </CardFooter>
                            </Card>
                        )}) :
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