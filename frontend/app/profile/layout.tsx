import { ReactNode } from 'react';
import NavBar from '@/components/MyNavbar';
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";


const ProfileLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <div>
            <NavBar/>
            {children}
            <Toaster/>
            <Footer/>
        </div>
    );
};

export default ProfileLayout;