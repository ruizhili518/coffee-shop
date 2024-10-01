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