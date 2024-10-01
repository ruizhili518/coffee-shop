'use client';
import React, {useEffect, useState} from 'react';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import {AppDispatch, useAppSelector} from "@/lib/store";
import {CldImage} from "next-cloudinary";
import {MinusIcon, PlusIcon} from "lucide-react";
import {useDispatch} from "react-redux";
import {addItemQuantity, emptyCart, minusItemQuantity} from "@/lib/features/cartSlice";
import {ScrollArea} from "@/components/ui/scroll-area";

const Cart = () => {
    let cart = useAppSelector((state) => state.cartReducer.value);
    const [ cartSize, setCartSize ] = useState(0);
    useEffect(() => {
        setCartSize(cart.length)
    }, [cart]);
    const dispatch = useDispatch<AppDispatch>();

    const emptyHandler = () => {
        dispatch(emptyCart());
    }

    const addQuantityHandler = (time: number) => {
        dispatch(addItemQuantity(time));
    }

    const minusQuantityHandler = (time: number) => {
        dispatch(minusItemQuantity(time));
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Avatar className="relative">
                    <AvatarImage src="/cart.png" alt="Cart" className="absolute right-0.5 cursor-pointer"/>
                    <span className={`absolute right-1.5 top-0.5 w-4 h-4 justify-center rounded-full bg-black text-white text-xs ${cartSize === 0 ? "hidden": "flex" }`}>{cartSize}</span>
                </Avatar>
            </SheetTrigger>
            <SheetContent>
                <ScrollArea className="h-[calc(100vh-3rem)]">
                <SheetHeader  className="w-11/12">
                    <SheetTitle>Cart</SheetTitle>
                    <SheetDescription>
                        Add and remove items, or empty your cart.
                    </SheetDescription>
                </SheetHeader>
                { cartSize !== 0 &&
                    cart.map(item => {
                        return(
                            <div className="flex justify-between mt-4 w-11/12" key={item.time}>
                                <div className="flex gap-2 items-center">
                                    <CldImage alt={item.product.name} src={item.product.image} width="100" height="100"/>
                                    <div className="flex flex-col h-24">
                                        <div className="font-bold hidden md:block">{item.product.name}</div>
                                        <div className="hidden md:block font-light text-sm text-gray-400">
                                            {item.product.customizations.map(cus => {
                                                if(cus.cusName === item.size){
                                                    return (
                                                        <div>
                                                            - {item.size}
                                                        </div>
                                                    )
                                                }
                                                if(cus.cusName === item.ice){
                                                    return (
                                                        <div>
                                                            - {item.ice}
                                                        </div>
                                                    )
                                                }
                                                if(cus.cusName === item.milk){
                                                    return (
                                                        <div>
                                                            - {item.milk}
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2 flex flex-col items-end justify-between">
                                    <div className="flex justify-center items-center gap-2">
                                        <Button variant="secondary" size="icon" className="rounded-full w-6 h-6" onClick={() => {minusQuantityHandler(item.time)}}>
                                            <MinusIcon className="w-4"/>
                                        </Button>
                                        <div>{item.amount}</div>
                                        <Button variant="outline" size="icon" className="rounded-full w-6 h-6" onClick={()=> {addQuantityHandler(item.time)}}>
                                            <PlusIcon className="w-4"/>
                                        </Button>
                                    </div>
                                    <div className="font-bold">
                                        $ {item.price}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    cartSize === 0 &&
                    <div className="my-4 w-11/12">
                        As you add menu items, they'll appear here. You'll have a chance to review before placing your order.
                    </div>
                }
                <SheetFooter>
                    <SheetClose asChild>
                        <div className="flex justify-evenly mt-8 w-full">
                            <Button onClick={emptyHandler} variant="secondary">Empty cart</Button>
                            <Button variant="outline">Check Out</Button>
                        </div>
                    </SheetClose>
                </SheetFooter>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

export default Cart;