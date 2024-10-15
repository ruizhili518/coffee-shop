'use client';
import {ReactNode, useEffect} from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";
import LoadingPage from "@/components/LoadingPage";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {useDispatch} from "react-redux";
import {finishLoading, setLoadingInitial} from "@/lib/features/loadingSlice";

const StoreLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useAppSelector((state) => state.loadingReducer.valueOf());

    return (
        <>
            <NavBar/>
            {children}
            <Footer/>
        </>
    )
};

export default StoreLayout;