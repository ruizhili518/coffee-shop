'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from 'lucide-react'
import Image from 'next/image'

// Mock data for demonstration
const orders = [
    {
        id: 'ORD-001',
        total: 150.00,
        customer: 'John Doe',
        orderTime: '2023-10-25 10:30',
        status: 'processing',
        image: '/placeholder.svg',
        customization: 'Extra large',
        memo: 'Fragile items'
    },
    {
        id: 'ORD-002',
        total: 75.50,
        customer: 'Jane Smith',
        orderTime: '2023-10-24 14:15',
        status: 'completed',
        image: '/placeholder.svg',
        customization: 'Gift wrap',
        memo: 'Birthday present'
    },
    {
        id: 'ORD-003',
        total: 200.00,
        customer: 'Bob Johnson',
        orderTime: '2023-10-26 09:45',
        status: 'processing',
        image: '/placeholder.svg',
        customization: 'Express shipping',
        memo: 'Urgent delivery'
    },
]

export default function OrderList() {
    const [activeTab, setActiveTab] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [expandedRows, setExpandedRows] = useState<string[]>([])

    const toggleRow = (orderId: string) => {
        setExpandedRows(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        )
    }

    const filteredOrders = orders.filter(order => {
        if (activeTab !== 'all' && order.status !== activeTab) return false
        if (startDate && new Date(order.orderTime) < new Date(startDate)) return false
        if (endDate && new Date(order.orderTime) > new Date(endDate)) return false
        return true
    })

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
                            <th className="text-left p-4 font-medium">Order Details</th>
                            <th className="text-left p-4 font-medium">Total Price</th>
                            <th className="text-left p-4 font-medium">Customer Name</th>
                            <th className="text-left p-4 font-medium">Order Time</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <>
                                <tr
                                    key={order.id}
                                    className="border-t hover:bg-muted/50 cursor-pointer"
                                    onClick={() => toggleRow(order.id)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={order.image}
                                                alt="Order thumbnail"
                                                width={40}
                                                height={40}
                                                className="rounded-md"
                                            />
                                            <span className="font-medium">{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">${order.total.toFixed(2)}</td>
                                    <td className="p-4">{order.customer}</td>
                                    <td className="p-4">{order.orderTime}</td>
                                    <td className="p-4">
                                        <Select defaultValue={order.status}>
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
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            {expandedRows.includes(order.id) ?
                                                <ChevronUp className="h-4 w-4" /> :
                                                <ChevronDown className="h-4 w-4" />
                                            }
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.includes(order.id) && (
                                    <tr className="bg-muted/50">
                                        <td colSpan={6} className="p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Customization</Label>
                                                    <p className="mt-1">{order.customization}</p>
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