import {ReactNode, useEffect} from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";

const StoreLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            <NavBar/>
            {children}
            <Footer/>
        </>
    )
};

export default StoreLayout;