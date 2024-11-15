'use client'

import React, {useEffect, useState} from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useAppSelector} from "@/lib/store";
import {changeOrderStatus, getOrderDataAnalysis, getOrders} from "@/api/api";
import LoadingPage from "@/components/LoadingPage";
import {Order, OrderData} from "@/lib/types";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { toast } from "sonner";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react"

export default function OrderHistory() {
    const userInformation = useAppSelector((state) => state.authReducer.value);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [proOrder, setProOrder] = useState<Order[]>([]);
    const [comOrder, setComOrder] = useState<Order[]>([]);
    const [orderData, setOrderData] = useState<OrderData>({
        recent7DaysRevenue: 0,
        revenueChange: 0,
        todaysRevenue: 0,
        todayRevenueChange: 0,
        todaysOrders: 0,
        orderChange: 0
    });
    const [activeTab, setActiveTab] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [expandedRows, setExpandedRows] = useState<string[]>([])

    useEffect(() => {
        const getAllOrders = async () => {
            const info = {role: userInformation.role , userId: userInformation.userId};
            const res = await getOrders(info);
            let allOrders = res.data.orders;
            allOrders = allOrders?.sort((a: Order,b: Order) => b.orderNumber - a.orderNumber);
            setOrders(allOrders);
            setProOrder(allOrders?.filter((order: Order) => order.orderStatus === "processing"));
            setComOrder(allOrders?.filter((order: Order) => order.orderStatus === "completed"))
        }

        const getOrderDA = async () => {
            const res = await getOrderDataAnalysis();
            console.log(res.data.data);
            setOrderData(res.data.data);
        }
        getAllOrders();
        userInformation.role === "ROLE_SUPERADMIN" && getOrderDA();
        setIsLoading(false);
    }, [userInformation , isLoading]);
    const toggleRow = (orderId: string) => {
        setExpandedRows(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        )
    };
    const filteredOrders = orders?.filter(order => {
        if (activeTab !== 'all' && order.orderStatus !== activeTab) return false
        if (startDate && new Date(order.createdAt) < new Date(startDate)) return false
        return !(endDate && new Date(order.createdAt) > new Date(endDate));
    });

    const handleStatusChange = async (id: string, newStatus: string) => {
        const orderData = {id, newStatus};
        const res = await changeOrderStatus(orderData);
        return res.status;
    }

    if(isLoading)
        return <LoadingPage/>
    return (
        <div className="flex min-h-screen flex-col items-center">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full lg:px-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {userInformation.role === "ROLE_SUPERADMIN" &&
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                            <Card className="flex-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Recent 7 Days Revenue</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$ {orderData?.recent7DaysRevenue}</div>
                                    <p className="text-xs text-muted-foreground">{orderData?.revenueChange > 0 ? `+${orderData?.revenueChange}`: `${orderData?.revenueChange}`} from last week</p>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$ {orderData?.todaysRevenue}</div>
                                    <p className="text-xs text-muted-foreground">{orderData?.todayRevenueChange > 0 ? `+${orderData?.todayRevenueChange}`: `${orderData?.todayRevenueChange}`} from yesterday</p>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Today&apos;s Orders</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{orderData?.todaysOrders}</div>
                                    <p className="text-xs text-muted-foreground">{orderData?.orderChange > 0 ? `+${orderData?.orderChange}`: `${orderData?.orderChange}`} orders from yesterday</p>
                                </CardContent>
                            </Card>
                        </div>
                    }

                    <Tabs defaultValue="all" onValueChange={setActiveTab}>
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="processing">Processing</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                            </TabsList>
                            <div className="flex gap-4 mb-4">
                                <div>
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Orders</CardTitle>
                                    <CardDescription>
                                        Manage your orders.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead className="w-[100px]">Order Number</TableHead>
                                                <TableHead>Total Price</TableHead>
                                                <TableHead>Customer Name</TableHead>
                                                <TableHead>Order Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:block">Get Points</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredOrders?.map((order) => (
                                                <>
                                                    <TableRow key={order._id} className="cursor-pointer"
                                                              onClick={() => toggleRow(order._id)}>
                                                        <TableCell
                                                            className="font-medium">#{order.orderNumber}</TableCell>
                                                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                                        <TableCell>{order.customerName}</TableCell>
                                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            {userInformation.role === "ROLE_SUPERADMIN" && <Select
                                                                defaultValue={order.orderStatus}
                                                                onValueChange={(value) => {
                                                                    handleStatusChange(order._id, value);
                                                                    toast.success(`Order #${order.orderNumber} status has been changed to ${value}.`);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-[130px]">
                                                                    <SelectValue placeholder="Select status"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        value="processing">Processing</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                </SelectContent>
                                                            </Select>}
                                                            {userInformation.role === "ROLE_USER" && order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                        </TableCell>
                                                        <TableCell>{order.pointsGet.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                    {expandedRows.includes(order._id) && (
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <div className="p-4 bg-muted/50">
                                                                    <h4 className="font-semibold mb-2">Order
                                                                        Details</h4>
                                                                    <div className="grid grid-cols-2 gap-20">
                                                                        <div>
                                                                            <h5 className="font-semibold">Items</h5>
                                                                            {order.items.map((item, index) => (
                                                                                <div key={index}
                                                                                     className="flex flex-col">
                                                                                    <div
                                                                                        className="flex w-full justify-between">
                                                                                        <div>
                                                                                            {item.product.name} * {item.amount}
                                                                                        </div>
                                                                                        <div>Price:
                                                                                            ${item.price.toFixed(2)}</div>
                                                                                    </div>

                                                                                    {item.product.customizations?.map(cus => {
                                                                                        if (cus.cusName === item.size) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.size + item.sizePrice}>
                                                                                                    - {item.size}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (cus.cusName === item.ice) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.ice + item.icePrice}>
                                                                                                    - {item.ice}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (cus.cusName === item.milk) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.milk + item.milkPrice}>
                                                                                                    - {item.milk}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    })}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="font-semibold">Memo</h5>
                                                                            <p>{order.memo}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{filteredOrders?.length}</strong> orders
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="processing">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Orders</CardTitle>
                                    <CardDescription>
                                        Manage your orders.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Order Number</TableHead>
                                                <TableHead>Total Price</TableHead>
                                                <TableHead>Customer Name</TableHead>
                                                <TableHead>Order Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Get Points</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredOrders?.map((order) => (
                                                <>
                                                    <TableRow key={order._id} className="cursor-pointer"
                                                              onClick={() => toggleRow(order._id)}>
                                                        <TableCell
                                                            className="font-medium">#{order.orderNumber}</TableCell>
                                                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                                        <TableCell>{order.customerName}</TableCell>
                                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            {userInformation.role === "ROLE_SUPERADMIN" && <Select
                                                                defaultValue={order.orderStatus}
                                                                onValueChange={(value) => {
                                                                    handleStatusChange(order._id, value);
                                                                    toast.success(`Order #${order.orderNumber} status has been changed to ${value}.`);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-[130px]">
                                                                    <SelectValue placeholder="Select status"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        value="processing">Processing</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                </SelectContent>
                                                            </Select>}
                                                            {userInformation.role === "ROLE_USER" && order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                        </TableCell>
                                                        <TableCell>{order.pointsGet.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                    {expandedRows.includes(order._id) && (
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <div className="p-4 bg-muted/50">
                                                                    <h4 className="font-semibold mb-2">Order
                                                                        Details</h4>
                                                                    <div className="grid grid-cols-2 gap-20">
                                                                        <div>
                                                                            <h5 className="font-semibold">Items</h5>
                                                                            {order.items.map((item, index) => (
                                                                                <div key={index}
                                                                                     className="flex flex-col">
                                                                                    <div
                                                                                        className="flex w-full justify-between">
                                                                                        <div>
                                                                                            {item.product.name} * {item.amount}
                                                                                        </div>
                                                                                        <div>Price:
                                                                                            ${item.price.toFixed(2)}</div>
                                                                                    </div>

                                                                                    {item.product.customizations?.map(cus => {
                                                                                        if (cus.cusName === item.size) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.size + item.sizePrice}>
                                                                                                    - {item.size}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (cus.cusName === item.ice) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.ice + item.icePrice}>
                                                                                                    - {item.ice}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (cus.cusName === item.milk) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.milk + item.milkPrice}>
                                                                                                    - {item.milk}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    })}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="font-semibold">Memo</h5>
                                                                            <p>{order.memo}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{filteredOrders?.length}</strong> orders
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="completed">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Orders</CardTitle>
                                    <CardDescription>
                                        Manage your orders.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Order Number</TableHead>
                                                <TableHead>Total Price</TableHead>
                                                <TableHead>Customer Name</TableHead>
                                                <TableHead>Order Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Get Points</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredOrders?.map((order) => (
                                                <>
                                                    <TableRow key={order._id} className="cursor-pointer"
                                                              onClick={() => toggleRow(order._id)}>
                                                        <TableCell
                                                            className="font-medium">#{order.orderNumber}</TableCell>
                                                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                                        <TableCell>{order.customerName}</TableCell>
                                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            {userInformation.role === "ROLE_SUPERADMIN" && <Select
                                                                defaultValue={order.orderStatus}
                                                                onValueChange={(value) => {
                                                                    handleStatusChange(order._id, value);
                                                                    toast.success(`Order #${order.orderNumber} status has been changed to ${value}.`);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-[130px]">
                                                                    <SelectValue placeholder="Select status"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        value="processing">Processing</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                </SelectContent>
                                                            </Select>}
                                                            {userInformation.role === "ROLE_USER" && order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                        </TableCell>
                                                        <TableCell>{order.pointsGet.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                    {expandedRows.includes(order._id) && (
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <div className="p-4 bg-muted/50">
                                                                    <h4 className="font-semibold mb-2">Order
                                                                        Details</h4>
                                                                    <div className="grid grid-cols-2 gap-20">
                                                                        <div>
                                                                            <h5 className="font-semibold">Items</h5>
                                                                            {order.items.map((item, index) => (
                                                                                <div key={index}
                                                                                     className="flex flex-col">
                                                                                    <div
                                                                                        className="flex w-full justify-between">
                                                                                        <div>
                                                                                            {item.product.name} * {item.amount}
                                                                                        </div>
                                                                                        <div>Price:
                                                                                            ${item.price.toFixed(2)}</div>
                                                                                    </div>

                                                                                    {item.product.customizations?.map(cus => {
                                                                                        if (cus.cusName === item.size) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.size + item.sizePrice}>
                                                                                                    - {item.size}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (cus.cusName === item.ice) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.ice + item.icePrice}>
                                                                                                    - {item.ice}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (cus.cusName === item.milk) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={item.milk + item.milkPrice}>
                                                                                                    - {item.milk}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    })}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="font-semibold">Memo</h5>
                                                                            <p>{order.memo}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{filteredOrders?.length}</strong> orders
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>)
}