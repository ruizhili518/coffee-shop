import {Instagram, Facebook, Twitch} from "lucide-react";

import { Separator } from '@/components/ui/separator';

const sections = [
    {
        title: 'Product',
        links: [
            { name: 'Overview', href: '#' },
            { name: 'Pricing', href: '#' },
            { name: 'Marketplace', href: '#' },
            { name: 'Features', href: '#' },
            { name: 'Integrations', href: '#' },
            { name: 'Pricing', href: '#' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About', href: '#' },
            { name: 'Team', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Contact', href: '#' },
            { name: 'Privacy', href: '#' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { name: 'Help', href: '#' },
            { name: 'Sales', href: '#' },
            { name: 'Advertise', href: '#' },
        ],
    },
];

const Footer = () => {
    return (
        <section className="flex justify-center mb-8">
            <div className="container px-4">
                <footer>
                    <Separator className="my-6"/>
                    <h3 className="text-xl">
                        Find more
                    </h3>
                    <ul className="flex gap-6 mt-6">
                        <li>
                            <a href="https://www.instagram.com/">
                                <Instagram/>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/">
                                <Facebook/>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.twitch.tv/">
                                <Twitch/>
                            </a>
                        </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-6">
                        © 2024 Eunnikoo Coffee Shop. All rights reserved.
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Footer;
