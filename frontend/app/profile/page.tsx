"use client";
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "@/lib/store";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {toast} from "sonner";
import {editProfileName} from "@/api/api";

const Page = () => {
    const userInformation = useAppSelector((state) => state.authReducer.value);

    const [userData, setUserData] = useState(userInformation)
    const [isEditing, setIsEditing] = useState(false)
    const [newCustomerName, setNewCustomerName] = useState(userData.customerName)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const data = {userId: userData.userId, newCustomerName }
            const res = await editProfileName(data);
            const newUser = res.data.newUser;
            setUserData(newUser);
            toast.success("Edit customer name successfully.")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to edit customer name. Please try again.");
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="container flex justify-center mx-auto">
            <Card className="w-2/3 min-w-96">
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex w-full justify-between">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <div className="font-medium">{userData.username}</div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="font-medium">{userData.email}</div>
                        </div>
                        <div className="space-y-2">
                            <Label>User ID</Label>
                            <div className="font-medium">{userData.userId}</div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-4">
                    <div className="w-1/2 space-y-2">
                        <Label>Customer Name</Label>
                        {isEditing ? (
                            <Input
                                value={newCustomerName}
                                onChange={(e) => setNewCustomerName(e.target.value)}
                                placeholder="Enter new name"
                            />
                        ) : (
                            <div className="font-medium">{userData.customerName}</div>
                        )}
                    </div>
                    <div className="space-y-2 w-1/2">
                        <Label>Points</Label>
                        <div className="font-medium">{userData.points.toFixed(2)}</div>
                    </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Name</Button>
                    )}
                </CardFooter>
            </Card>
        </div>);
};

export default Page;