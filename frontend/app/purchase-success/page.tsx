'use client';

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "@/lib/store";
import { useSearchParams } from 'next/navigation';
import {Suspense, useEffect, useState} from "react";
import {checkSuccess} from "@/api/api";
import {initialCart} from "@/lib/features/cartSlice";
import LoadingPage from "@/components/LoadingPage";

const PurchaseSuccessPage = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const sessionId  = searchParams.get('session_id');
    const cart = useAppSelector((state) => state.cartReducer.value);
    const [isLoading, setIsLoading] = useState(true);
    const [orderNumber, setOrderNumber] = useState("");
    const [customerName, setCustomerName] = useState("");

    const userInformation = useAppSelector((state) => state.authReducer.value);

    useEffect(() => {
        const checkoutSuccess = async () => {
            const data = {sessionId,cart};
            const res = await checkSuccess(data);
            setOrderNumber(res.data.orderNumber);
            setCustomerName(res.data.customerName);
        }
        checkoutSuccess();
        dispatch(initialCart());
        setIsLoading(false);
    }, [cart, dispatch, sessionId]);

    if(isLoading){
        return <Suspense><LoadingPage/></Suspense>
    }
    return (
        <Suspense>
        <div className="flex items-center justify-center p-8">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 px-6 pb-8 flex flex-col items-center text-center">
                    <div className="flex gap-4 items-center mb-2">
                        <div className="bg-green-100 rounded-full p-2">
                            <div className="bg-green-500 rounded-full p-1">
                                <Check className="w-6 h-6 text-white"/>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold">Purchase Successful!</h1>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Thank you for your order, {customerName}. We are processing it now.
                        Please keep your order number in mind, we may ask you for your number.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
                        <p className="text-sm text-gray-600 mb-1">Order Number</p>
                        <p className="text-lg font-semibold">{orderNumber}</p>
                    </div>
                    <div className="space-y-2 w-full">
                        { userInformation.role !== 'ROLE_VISITOR' &&
                            <Button className="w-full" onClick={() => {router.push('/order-history')}}>View Order History</Button>
                        }
                        <Button variant="outline" className="w-full" onClick={() => {router.push('/menu')}}>
                            Continue Shopping
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        </Suspense>
    );
};

export default PurchaseSuccessPage;