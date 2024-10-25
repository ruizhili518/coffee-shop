import {ReactNode} from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";

const CheckoutLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            <NavBar/>
            {children}
            <Footer/>
        </>
    )
};

export default CheckoutLayout;