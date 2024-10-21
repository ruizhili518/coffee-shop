'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from "next/image";
import {useAppSelector} from "@/lib/store";
import {useRouter} from "next/navigation";

const Hero = () => {
    const userInfo = useAppSelector((state) => state.authReducer.value);
    const router = useRouter();

    return (
        <section className="flex justify-center">
            <div className='container'>
                <div className='grid items-center px-4 gap-8 lg:grid-cols-2 lg:px-0'>
                    <div className='flex flex-col items-center py-32 text-center lg:mx-auto lg:items-start lg:px-0 lg:text-left'>
                        <p>New Release</p>
                        <h1 className='my-6 text-pretty text-4xl font-bold lg:text-6xl'>
                            Welcome to Eunnikoo
                        </h1>
                        <p className='mb-8 max-w-xl text-muted-foreground lg:text-xl'>
                            This is where Unique meets Magic. A space where creativity flows as freely as our coffee. A place to gather, unwind, and be inspired. Start discovering a one-of-a-kind coffee experience now!
                        </p>
                        <div className='flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start'>
                            <Button className='w-full sm:w-auto' onClick={() => {
                                userInfo.role === "ROLE_VISITOR" ? router.push('/sign-in') : router.push('/menu')
                            }}>
                                <ArrowRight className='mr-2 size-4' />
                                {
                                    userInfo.role === "ROLE_VISITOR" ? `Sign In & Order` : `Order Now`
                                }
                            </Button>
                            { userInfo.role === "ROLE_VISITOR" &&
                                <Button
                                    variant='outline'
                                    className='w-full sm:w-auto'
                                    onClick={() => {
                                        router.push('/menu')
                                    }}
                                >
                                    Order as a visitor
                                </Button>
                            }
                        </div>
                    </div>
                    <Image src="/hero.jpg" height="500" width="1000" alt="hero"/>
                </div>
            </div>
        </section>
    )
}

export default Hero;

//TODO: Toggle button status based on user.
