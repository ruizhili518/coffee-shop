// Product and customization type.
export type Customization = {
    cusCategory: string,
    cusName: string,
    extraprice: number
}
export type Product = {
    name:string,
    status:string,
    baseprice:number,
    description:string,
    category:string,
    image:string,
    buy:number,
    getFree:number,
    customizations:Customization[],
    _id:string,
    updatedAt: string
}

export type Order = {
    createdAt: string,
    customerName: string,
    items: Item[],
    memo: string,
    orderNumber: number,
    orderStatus: string,
    pointsGet: number,
    sessionId: string,
    totalPrice: number,
    updatedAt: string,
    userId: number,
    __v: number,
    _id: string,
}

export type Item = {
    amount: number,
    ice: string,
    icePrice: number,
    milk: string,
    milkPrice: number,
    price: number,
    product: Product,
    size: string,
    sizePrice: number,
    time: number,
    _id: string
}

export type OrderData = {
    recent7DaysRevenue: number,
    revenueChange: '84.98',
    todaysRevenue: 0,
    todayRevenueChange: '-35.50',
    todaysOrders: 0,
    orderChange: '-2.00'

}