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
import {addItemQuantity, deleteItem, minusItemQuantity} from "@/lib/features/cartSlice";
import {ScrollArea} from "@/components/ui/scroll-area";
import Image from "next/image";
import {useRouter} from "next/navigation";

const Cart = () => {
    const router = useRouter();

    // Create cart slice, modify cart size and subtotal prize by state.
    let cart = useAppSelector((state) => state.cartReducer.value);
    const [ cartSize, setCartSize ] = useState(0);
    const [subtotal , setSubtotal] = useState(0);
    useEffect(() => {
        setCartSize(cart.length);
        setSubtotal(0);
        cart.map(item => setSubtotal(prevState => prevState + item.price))
    }, [cart]);

    const dispatch = useDispatch<AppDispatch>();

    // Cart item handler.
    const deleteHandler = (time: number) => {
        dispatch(deleteItem(time));
    };
    const addQuantityHandler = (time: number) => {
        dispatch(addItemQuantity(time));
        console.log(cart);
    };
    const minusQuantityHandler = (time: number) => {
        dispatch(minusItemQuantity(time));
    };

    // Checkout handler
    const checkoutHandler = () => {
        cart.length !== 0 && router.push('/checkout');
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
                            <div className="flex flex-col justify-between mt-2 w-10/12 border-b-2" key={item.time}>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col items-start justify-between h-24 py-3 px-2">
                                        <div className="font-bold text-sm">{item.product.name}</div>
                                        <div className="font-light text-sm text-gray-400">
                                            {item.product.customizations.map(cus => {
                                                if (cus.cusName === item.size) {
                                                    return (
                                                        <div key={item.size+item.sizePrice}>
                                                            - {item.size}
                                                        </div>
                                                    )
                                                }
                                                if (cus.cusName === item.ice) {
                                                    return (
                                                        <div key={item.ice+item.icePrice}>
                                                            - {item.ice}
                                                        </div>
                                                    )
                                                }
                                                if (cus.cusName === item.milk) {
                                                    return (
                                                        <div key={item.milk+item.milkPrice}>
                                                            - {item.milk}
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                    <CldImage alt={item.product.name} src={item.product.image} width="100"
                                              height="100"/>
                                </div>
                                <div className="py-2 flex justify-between items-center">
                                    <div className="flex justify-center items-center gap-2 px-2">
                                        <Button variant="outline" size="icon" className="rounded-full w-6 h-6"
                                                onClick={() => {
                                                    minusQuantityHandler(item.time)
                                                }}>
                                            <MinusIcon className="w-4"/>
                                        </Button>
                                        <div>{item.amount}</div>
                                        <Button variant="outline" size="icon" className="rounded-full w-6 h-6 bg-black text-white"
                                                onClick={() => {
                                                    addQuantityHandler(item.time)
                                                }}>
                                            <PlusIcon className="w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            deleteHandler(item.time)
                                        }}>
                                            <Image src="/delete.png" alt="delete" width="20" height="20"/>
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
                    cartSize !== 0 &&
                    <div className="w-10/12 py-4 flex font-bold justify-end">
                        Subtotal: $ {subtotal.toFixed(2)}
                    </div>
                }
                {
                    cartSize === 0 &&
                    <div className="my-4 w-11/12">
                        As you add menu items, they will appear here. You will have a chance to review before placing your order.
                    </div>
                }
                    <SheetFooter className="flex justify-start w-10/12">
                        <SheetClose asChild>
                            { cart.length === 0 ?
                                <Button variant="outline" className="w-full" onClick={() => {router.push("/menu")}}>
                                    Go to the Menu
                                </Button>:
                            <Button variant="outline" className="w-full" onClick={checkoutHandler}
                            >Check Out</Button>
                            }
                        </SheetClose>
                </SheetFooter>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

export default Cart;