import React from 'react';
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
import {useAppSelector} from "@/lib/store";
import {CldImage} from "next-cloudinary";
import {MinusIcon, PlusIcon} from "lucide-react";

const Cart = () => {
    let cart = useAppSelector((state) => state.cartReducer.value);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Avatar className="relative">
                    <AvatarImage src="/cart.png" alt="Cart" className="absolute right-0.5"/>
                    {/*<span className={`absolute right-1.5 top-0.5 w-4 h-4 items-center justify-center rounded-full bg-black text-white text-sm ${cart.length === 0 ? "hidden": "flex" }`}>{cart.length}</span>*/}
                </Avatar>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cart</SheetTitle>
                    <SheetDescription>
                        Add and remove items, or empty your cart.
                    </SheetDescription>
                </SheetHeader>
                {
                    cart.map(item => {
                        return(
                            <div className="flex justify-between mt-4">
                                <div className="flex gap-2 items-center">
                                    <CldImage alt={item.name} src={item.image} width="100" height="100"/>
                                    <div className="flex-col">
                                        <div className="font-bold">{item.name}</div>
                                        <div className="font-light text-sm text-gray-400">
                                            <div>
                                                - {item.size}
                                            </div>
                                            <div>
                                                - {item.ice}
                                            </div>
                                            <div>
                                                - {item.milk}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-col justify-between">
                                    <div className="flex justify-center items-center gap-2">
                                        <Button variant="outline" size="icon" className="rounded-full w-6 h-6">
                                            <MinusIcon className="w-4"/>
                                        </Button>
                                        <div>{item.amount}</div>
                                        <Button size="icon" className="rounded-full w-6 h-6">
                                            <PlusIcon className="w-4"/>
                                        </Button>
                                    </div>
                                    <div>
                                        $ {item.price}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default Cart;