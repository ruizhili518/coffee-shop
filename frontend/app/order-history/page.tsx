'use client'

import {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from 'lucide-react'
import {useAppSelector} from "@/lib/store";
import {getOrders} from "@/api/api";
import LoadingPage from "@/components/LoadingPage";

// const orders = [
//     {
//         createdAt: "2024-10-29T21:57:50.739Z",
//         customerName: "John Doe",
//         items: [{ name: "Product 1", quantity: 2, price: 2.99 }],
//         memo: "Handle with care",
//         orderNumber: 1065,
//         orderStatus: "processing",
//         pointsGet: 149.25,
//         sessionId: "cs_test_a1N6YybcijjgyvhIQMnlQ2bBD055Ik81F1CmXs1pET7JyGoqtWVxKBygCE",
//         totalPrice: 5.97,
//         updatedAt: "2024-10-29T21:57:50.739Z",
//         userId: 1012,
//         __v: 0,
//         _id: "67215a5e0daead3489ffe442"
//     },
//     {
//         createdAt: "2024-10-28T15:30:00.000Z",
//         customerName: "Jane Smith",
//         items: [{ name: "Product 2", quantity: 1, price: 10.99 }],
//         memo: "Gift wrap requested",
//         orderNumber: 1066,
//         orderStatus: "completed",
//         pointsGet: 274.75,
//         sessionId: "cs_test_b2M7ZzcdjkkgzwiJRNnmR3cCE166Jl92G2DnYt2qFU8KzHprwXWyLCzhDF",
//         totalPrice: 10.99,
//         updatedAt: "2024-10-28T16:45:00.000Z",
//         userId: 1013,
//         __v: 0,
//         _id: "67215a5e0daead3489ffe443"
//     },
// ]

export default function OrderHistory() {
    const userInformation = useAppSelector((state) => state.authReducer.value);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([{
        createdAt: "",
        customerName: "",
        items: [{}],
        memo: "",
        orderNumber: null,
        orderStatus: "",
        pointsGet: null,
        sessionId: "",
        totalPrice: null,
        updatedAt: "",
        userId: null,
        __v: null,
        _id: ""
    }]);

    const getAllOrders = async () => {
        const info = {role: userInformation.role , userId: userInformation.userId};
        const res = await getOrders(info);
        const allOrders = res.data.orders;
        setOrders(allOrders);
    }

    useEffect(() => {
        getAllOrders();
        setIsLoading(false);
    }, [userInformation]);

    const [activeTab, setActiveTab] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [expandedRows, setExpandedRows] = useState<string[]>([])

    const toggleRow = (orderId: string) => {
        setExpandedRows(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        )
    }

    const filteredOrders = orders?.filter(order => {
        if (activeTab !== 'all' && order.orderStatus !== activeTab) return false
        if (startDate && new Date(order.createdAt) < new Date(startDate)) return false
        if (endDate && new Date(order.createdAt) > new Date(endDate)) return false
        return true
    })

    if(isLoading)
        return <LoadingPage/>

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="space-x-1">
                    <Button
                        variant={activeTab === 'all' ? "secondary" : "ghost"}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={activeTab === 'processing' ? "secondary" : "ghost"}
                        onClick={() => setActiveTab('processing')}
                    >
                        Processing
                    </Button>
                    <Button
                        variant={activeTab === 'completed' ? "secondary" : "ghost"}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed
                    </Button>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Order
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold">Orders</h1>
                    <p className="text-muted-foreground">Manage your orders.</p>
                </div>

                <div className="px-4 py-3 border-t flex gap-4">
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-[160px]"
                        />
                    </div>
                    <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-[160px]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-t">
                            <th className="text-left p-4 font-medium">Order Number</th>
                            <th className="text-left p-4 font-medium">Total Price</th>
                            <th className="text-left p-4 font-medium">Customer Name</th>
                            <th className="text-left p-4 font-medium">Order Date</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders?.map(order => (
                            <>
                                <tr
                                    key={order._id}
                                    className="border-t hover:bg-muted/50 cursor-pointer"
                                    onClick={() => toggleRow(order._id)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">#{order.orderNumber}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">${order.totalPrice}</td>
                                    <td className="p-4">{order.customerName}</td>
                                    <td className="p-4">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="p-4">
                                        <Select defaultValue={order.orderStatus}>
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {expandedRows.includes(order._id) ?
                                                <ChevronUp className="h-4 w-4" /> :
                                                <ChevronDown className="h-4 w-4" />
                                            }
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.includes(order._id) && (
                                    <tr className="bg-muted/50">
                                        <td colSpan={7} className="p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Items</Label>
                                                    {order.items.map(item => {
                                                        return (<ul className="mt-1 space-y-1" key={item.product._id}>
                                                            {item.product.name}
                                                        </ul>)
                                                    })
                                                    }
                                                </div>
                                                <div>
                                                    <Label>Memo</Label>
                                                    <p className="mt-1">{order.memo}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}