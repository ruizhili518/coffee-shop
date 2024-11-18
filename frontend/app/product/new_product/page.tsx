"use client";
import Image from "next/image"
import {
    ChevronLeft,
    PlusCircle,
    Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import React, {useEffect, useRef, useState} from "react";
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {createProduct} from "@/api/api";
import MyAlert from "@/components/ui/MyAlert";
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter();
    // Form design.
    const customizationSchema = z.object({
        cusCategory: z.string().optional(),
        cusName: z.string().optional(),
        extraprice: z.string().optional(),
    });
      //1.Form schema
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Product name is required.",
        }),
        description: z.string().min(1,{
            message: "Product description is required.",
        }),
        baseprice: z.string().min(1,{
            message: "Product base price is required.",
        }),
        customizations: z.array(customizationSchema).optional(),
        buy: z.string(),
        getFree: z.string(),
        status: z.string().min(1, {
            message: "Product status is required."
        }),
        category: z.string().min(1, {
            message: "Product category is required.",
        }),
    });
      // 2.Make form field and values.
    type FormValues = z.infer<typeof formSchema>;

    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customizations: [{
                cusCategory: "",
                cusName: "",
                extraprice: ""
            }],
            buy: "0",
            getFree: "0"// Start with one empty customer pricing group
        }
    });

    const { control , handleSubmit, setValue, formState: { errors } } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "customizations"
    });
      // 3. Submit handler.
    const onSubmit = async (values: FormValues) => {
        if(selectedFile) {
            setImgErr("hidden");
            const formData = new FormData();
            for(let key in values){
                if( key !== "customizations"){
                    // @ts-ignore
                    formData.append(key, values[key]);
                }else{
                    formData.append(key, JSON.stringify(values[key]))
                }
            }
            formData.append("image", selectedFile);
            try {
                const res = await createProduct(formData);
                if(res.status === 200){
                    setAlertTitle("Create product successfully")
                    setAlertDesc("You will soon be redirected to the products page.")
                    setShowAlert(true);
                    setTimeout(() => { router.push("/product") } , 2500);
                }
            }catch (err: any){
                setAlertTitle("Failed to create product")
                if(err.response.data.error.includes("duplicate")){
                    setAlertDesc("The product name is duplicated. Please try a different product name.");
                    setShowAlert(true)
                }else{
                    setAlertDesc("Something wrong with the server. Please try again later.");
                    setShowAlert(true)
                }
            }
        }else{
            setImgErr("block")
        }
    }

    // Image state (both file and previewURL)
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [ imgErr , setImgErr ] = useState("hidden");

    // Handle image upload
    // @ts-ignore
    const handleImageUpload = (e) => {
        setImgErr("hidden");
        const file = e.target.files[0]; // Get the uploaded file
        if (file) {
            // Set the selected file to state
            setSelectedFile(file);

            // Create a preview URL for the uploaded image
            const imageURL = URL.createObjectURL(file);
            setPreviewURL(imageURL);
        }
    };

    // Ref to the hidden file input.
    const fileInputRef = useRef(null);
    const triggerFileInput = () => {
        // @ts-ignore
        fileInputRef.current.click(); // Open file dialog
    };

    // Alert Dialog Trigger
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertDesc, setAlertDesc] = useState("");
    // To make the alert disappear automatically in 2 seconds once it shows.
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert(false)
        }, 2000) // 2 seconds

        return () => clearTimeout(timer)
    }, [showAlert])

    return (

        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <MyAlert isVisible={showAlert} title={alertTitle} desc={alertDesc}/>
            <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => {router.push('/product')}}>
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Add New Product
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button type="button" variant="outline" size="sm" onClick={() => {router.push('/product')}}>
                            Discard
                        </Button>
                        <Button size="sm" type="submit">Save Product</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        {/*Left three cards.*/}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                                <CardDescription>
                                    Edit product name and description.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Name</Label>
                                        <FormField
                                            control={control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            className="w-full"
                                                            placeholder="e.g Americano"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <FormField
                                            control={control}
                                            name="description"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            id="description"
                                                            placeholder="e.g Double espresso, refreshingly invigorating, cooling you all summer."
                                                            className="min-h-20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="baseprice">Base Price</Label>
                                        <FormField
                                            control={control}
                                            name="baseprice"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            id="baseprice" type="text" className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Customization</CardTitle>
                                <CardDescription>
                                    Edit product customization. Enter the customization name and price according to the
                                    customization category, and customizations of the same category will be
                                    automatically grouped.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.length !== 0 ? fields.map((field, index) => {
                                                return (
                                                    <TableRow key={field.id}>
                                                        <TableCell>
                                                            <Label htmlFor={`customizations.${index}.cusCategory`}
                                                                   className="sr-only">
                                                                category
                                                            </Label>
                                                            <FormField
                                                                control={control}
                                                                name={`customizations.${index}.cusCategory`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                id={`customizations.${index}.cusCategory`}
                                                                                type="text"
                                                                                placeholder="e.g size"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor={`customizations.${index}.cusName`} className="sr-only">
                                                                name
                                                            </Label>
                                                            <FormField
                                                                control={control}
                                                                name={`customizations.${index}.cusName`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                id={`customizations.${index}.cusName`}
                                                                                type="text"
                                                                                placeholder="e.g large"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor={`customizations.${index}.extraprice`} className="sr-only">
                                                                price
                                                            </Label>
                                                            <FormField
                                                                control={control}
                                                                name={`customizations.${index}.extraprice`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                id={`customizations.${index}.extraprice`}
                                                                                type="text"
                                                                                placeholder="e.g 0.5"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="outline"
                                                                    id={`btn${index}`} onClick={() => remove(index)}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }) :
                                            <TableRow>
                                                <TableCell>
                                                    Press &quot;Add Variant&quot; to customizations.
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="justify-center border-t p-4">
                                <Button type="button" size="sm" variant="ghost" className="gap-1" onClick={() => append({cusCategory: "",cusName: "",extraprice: ""})}>
                                    <PlusCircle className="h-3.5 w-3.5"/>
                                    Add Variant
                                </Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <FormField
                                            control={control}
                                            name="category"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            id="category"
                                                            aria-label="Select category"
                                                        >
                                                            <SelectValue placeholder="Select category"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Drinks">Drinks</SelectItem>
                                                            <SelectItem value="Food">
                                                                Food
                                                            </SelectItem>
                                                            <SelectItem value="Merchandise">
                                                                Merchandise
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        {/*Right three cards.*/}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Status</Label>
                                        <FormField
                                            control={control}
                                            name="status"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger id="status" aria-label="Select status">
                                                                <SelectValue placeholder="Select status"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                                            <SelectItem value="Active">Active</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                                <CardDescription>
                                    Edit product images.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-contain"
                                        height="300"
                                        src={previewURL? previewURL : '/placeholder.svg'}
                                        width="300"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            ref={fileInputRef}
                                        />
                                        <button
                                            type="button"
                                            className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed" onClick={triggerFileInput}>
                                            <Upload className="h-4 w-4 text-muted-foreground"/>
                                            <span className="sr-only">Upload</span>
                                        </button>
                                    </div>
                                </div>
                                <Alert variant="destructive" className={`mt-4 ${imgErr}`}>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        Please upload an image.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Promotion</CardTitle>
                                <CardDescription>Modify promotion for the product. By default there is no
                                    promotion.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-1">
                                <CardDescription>Buy</CardDescription>
                                <Label htmlFor={"buy"} className="sr-only">
                                    buy
                                </Label>
                                <FormField
                                    control={control}
                                    name="buy"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="buy"
                                                    type="text"
                                                    placeholder="0"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <CardDescription>get</CardDescription>
                                <Label htmlFor={"getFree"} className="sr-only">
                                    get
                                </Label>
                                <FormField
                                    control={control}
                                    name="getFree"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="getFree"
                                                    type="text"
                                                    placeholder="0"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <CardDescription>free.</CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button type="button" variant="outline" size="sm" onClick={() => {router.push('/product')}}>
                        Discard
                    </Button>
                    <Button size="sm" type="submit">Save Product</Button>
                </div>
            </form>
            </FormProvider>
        </div>
    );
};

export default Page;