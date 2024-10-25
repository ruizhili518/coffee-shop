'use client';

import React, {useEffect, useState} from 'react';
import {Minus, MinusIcon, Plus, PlusIcon, Trash2} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {AppDispatch, useAppSelector} from "@/lib/store";
import LoadingPage from "@/components/LoadingPage";
import {CldImage} from "next-cloudinary";
import Image from "next/image";
import {useDispatch} from "react-redux";
import {addItemQuantity, deleteItem, minusItemQuantity} from "@/lib/features/cartSlice";
import {getRedeemPointRatio} from "@/api/api";
import {loadStripe} from "@stripe/stripe-js/";

const stripePromise = loadStripe("pk_test_51QDDjRCTN34WYNT4JF7d2Z84GBtt7jgtrO5uyJW9dOxrlmB0neqmUhtR4b5kiL5WfnhmHbE8ivT3uT6REFwpD5ES00vLVY7PzK");

export default function Checkout() {
    const [isLoading, setIsLoading] = useState(true);
    const user = useAppSelector((state) => state.authReducer.value);
    const cart = useAppSelector((state) => state.cartReducer.value);
    const dispatch = useDispatch<AppDispatch>();

    const deleteHandler = (time: number) => {
        dispatch(deleteItem(time));
    };
    const addQuantityHandler = (time: number) => {
        dispatch(addItemQuantity(time));
    };
    const minusQuantityHandler = (time: number) => {
        dispatch(minusItemQuantity(time));
    };

    const [subtotal , setSubtotal] = useState(0);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [memo, setMemo] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [redeemRatio, setRedeemRatio] = useState(0);

    const getRedeemRatio = async () => {
        const res = await getRedeemPointRatio();
        setRedeemRatio(res.data.ratio.ratio);
    }

    const handlePointsChange = (value: string) => {
        const points = Math.min(Math.min(Math.max(0, parseInt(value) || 0), user.points),subtotal / redeemRatio);
        setPointsToRedeem(points)
    }
    const totalPrice = subtotal - (pointsToRedeem * redeemRatio);

    // After user and cart loading, set the loading to false. And each time cart changed, modify subtotal.
    useEffect(() => {
        setSubtotal(0);
        cart.map(item => setSubtotal(prevState => prevState + item.price))
        setCustomerName(user.customerName);
    }, [user,cart]);

    useEffect(() => {
        getRedeemRatio();
        setIsLoading(false);
    }, []);

    const payHandler = async () => {
        const stripe = await stripePromise;
        console.log(stripe);
    }

    if(isLoading) return <LoadingPage/>
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold">Checkout</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-7/12">
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" onChange={(e) => setCustomerName(e.target.value)} defaultValue={user.customerName}/>
                        </div>
                        <div>
                            <Label htmlFor="memo">Order Memo</Label>
                            <Textarea
                                id="memo"
                                placeholder="Any special instructions?"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>
                        {user.role !== 'ROLE_VISITOR' && (
                            <div>
                                <Label htmlFor="points">Points to Redeem  (Max:{Math.min(subtotal/redeemRatio, user.points).toFixed(0)})</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    value={pointsToRedeem}
                                    onChange={(e) => handlePointsChange(e.target.value)}
                                    min="0"
                                    max={Math.min(subtotal/redeemRatio, user.points).toFixed(0)}
                                />
                            </div>
                        )}
                    </form>
                </div>
                <div className="md:w-5/12">
                    <h2 className="text-xl font-semibold mb-4">Items</h2>
                    <div className="max-h-80 overflow-y-auto mb-4">
                        { cart.length !== 0 && cart.map(item => {
                            return (
                                <div className="flex flex-col justify-between py-2 px-4 border-b-2" key={item.time}>
                                    <div className="flex justify-between">
                                        <div className="font-bold text-lg">{item.product.name}</div>
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            deleteHandler(item.time)
                                        }}>
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
                                            <Button variant="outline" size="icon" className="rounded-full w-6 h-6" onClick={() => {
                                                minusQuantityHandler(item.time)
                                            }}>
                                                <MinusIcon className="w-4"/>
                                            </Button>
                                            <div>{item.amount}</div>
                                            <Button variant="outline" size="icon"
                                                    className="rounded-full w-6 h-6 bg-black text-white" onClick={() => {
                                                addQuantityHandler(item.time)
                                            }}>
                                                <PlusIcon className="w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 font-bold px-4 self-end">
                                        $ {item.price.toFixed(2)}
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
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <Button className="w-full mt-4" onClick={payHandler}>Proceed to Payment</Button>
                </div>
            </div>
        </div>
    )
}