'use client';
import { ReactNode } from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "@/lib/store";

const ProductLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useAppSelector((state) => state.loadingReducer.valueOf());
    return (
        <>
            <NavBar/>
            {children}
            <Footer/>
        </>
    );
};

export default ProductLayout;