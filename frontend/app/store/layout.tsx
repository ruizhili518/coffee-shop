import {ReactNode} from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const StoreLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            <NavBar/>
            {children}
            <Footer/>
            <Toaster/>
        </>
    )
};

export default StoreLayout;