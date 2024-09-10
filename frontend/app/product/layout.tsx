import { ReactNode } from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";


const ProductLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <section>
            <NavBar/>
            {children}
            <Footer/>
        </section>
    );
};

export default ProductLayout;