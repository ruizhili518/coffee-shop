'use client';

import React, {useEffect, useState} from 'react';
import {Minus, MinusIcon, Plus, PlusIcon, Trash2} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {useAppSelector} from "@/lib/store";
import LoadingPage from "@/components/LoadingPage";
import {CldImage} from "next-cloudinary";
import Image from "next/image";

// Mock data for demonstration

const mockCartItems = [
    { id: 1, name: "Espresso", options: "Double shot", price: 3.50, quantity: 1 },
    { id: 2, name: "Cappuccino", options: "Extra foam", price: 4.50, quantity: 2 },
    { id: 3, name: "Croissant", options: "Butter", price: 2.50, quantity: 1 },
]

export default function Component() {
    const [isLoading, setIsLoading] = useState(true);
    const user = useAppSelector((state) => state.authReducer.value);
    const cart = useAppSelector((state) => state.cartReducer.value);
    useEffect(() => {
        setIsLoading(false);
        console.log(cart);
        console.log(user);
    }, [user,cart]);

    const [cartItems, setCartItems] = useState(mockCartItems)
    const [pointsToRedeem, setPointsToRedeem] = useState(0)

    const updateQuantity = (id: number, change: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + change) }
                    : item
            ).filter(item => item.quantity > 0)
        )
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal - (pointsToRedeem / 100) // Assuming 1 point = $0.01

    if(isLoading) return <LoadingPage/>
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold">Checkout</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={user.customerName} />
                        </div>
                        <div>
                            <Label htmlFor="memo">Order Memo</Label>
                            <Textarea id="memo" placeholder="Any special instructions?" />
                        </div>
                        { user.role !== 'ROLE_VISITOR' && (
                            <div>
                                <Label htmlFor="points">Points to Redeem</Label>
                                <Select
                                    value={pointsToRedeem.toString()}
                                    onValueChange={(value) => setPointsToRedeem(Number(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select points to redeem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[0, 50, 100].map(points => (
                                            <SelectItem key={points} value={points.toString()} disabled={points > user.points}>
                                                {points}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Items</h2>
                    <div className="max-h-80 overflow-y-auto mb-4">
                        {cart.map(item => {
                            return(
                                <div className="flex flex-col justify-between py-2 px-4 border-b-2 justify-items-stretch" key={item.time}>
                                    <div className="flex justify-between">
                                        <div className="font-bold text-lg">{item.product.name}</div>
                                        <Button variant="ghost" size="icon">
                                            <Image src="/delete.png" alt="delete" width="20" height="20"/>
                                        </Button>

                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-4">
                                            <CldImage alt={item.product.name} src={item.product.image} width="100"
                                                  height="100"/>
                                            <div className="font-light text-sm text-gray-400">
                                            {item.product.customizations.map(cus => {
                                                if (cus.cusName === item.size) {
                                                    return (
                                                        <div key={item.size + item.sizePrice}>
                                                            - {item.size}
                                                        </div>
                                                    )
                                                }
                                                if (cus.cusName === item.ice) {
                                                    return (
                                                        <div key={item.ice + item.icePrice}>
                                                            - {item.ice}
                                                        </div>
                                                    )
                                                }
                                                if (cus.cusName === item.milk) {
                                                    return (
                                                        <div key={item.milk + item.milkPrice}>
                                                            - {item.milk}
                                                        </div>
                                                    )
                                                }
                                            })}
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center gap-2 px-2">
                                            <Button variant="outline" size="icon" className="rounded-full w-6 h-6">
                                                <MinusIcon className="w-4"/>
                                            </Button>
                                            <div>{item.amount}</div>
                                            <Button variant="outline" size="icon"
                                                    className="rounded-full w-6 h-6 bg-black text-white">
                                                <PlusIcon className="w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-2 font-bold justify-self-end">
                                        $ {item.price}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {pointsToRedeem > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Points Redeemed</span>
                                <span>-${(pointsToRedeem / 100).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <Button className="w-full mt-4">Proceed to Payment</Button>
                </div>
            </div>
        </div>
    )
}