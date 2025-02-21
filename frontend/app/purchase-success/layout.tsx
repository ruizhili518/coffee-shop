import { ReactNode } from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";


const PurchaseSuccessLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <div>
            <NavBar/>
            {children}
            <Footer/>
        </div>
    );
};

export default PurchaseSuccessLayout;