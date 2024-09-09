// import {
//     FaApple,
//     FaDiscord,
//     FaRedditAlien,
//     FaTelegramPlane,
//     FaTwitter,
// } from 'react-icons/fa';

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

const Footer1 = () => {
    return (
        <section className="flex justify-center mb-8">
            <div className="container">
                <footer>
                    <Separator className="my-6"/>
                    <div className="grid gap-8 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-0">
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.href}>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div>
                            <h3 className="mb-4 font-bold">Legal</h3>
                            <ul className="space-y-4 text-muted-foreground">
                                <li className="font-medium hover:text-primary">
                                    <a href="#">Term of Services</a>
                                </li>
                                <li className="font-medium hover:text-primary">
                                    <a href="#">Privacy Policy</a>
                                </li>
                            </ul>
                            <h3 className="mb-4 mt-8 font-bold">Social</h3>
                            <ul className="flex items-center space-x-6 text-muted-foreground">
                                <li className="font-medium hover:text-primary">
                                    <a href="#">
                                        {/*<FaDiscord className="size-6" />*/}
                                    </a>
                                </li>
                                <li className="font-medium hover:text-primary">
                                    <a href="#">
                                        {/*<FaRedditAlien className="size-6" />*/}
                                    </a>
                                </li>
                                <li className="font-medium hover:text-primary">
                                    <a href="#">
                                        {/*<FaTwitter className="size-6" />*/}
                                    </a>
                                </li>
                                <li className="font-medium hover:text-primary">
                                    <a href="#">
                                        {/*<FaTelegramPlane className="size-6" />*/}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Separator className="my-6" />
                    <p className="text-sm text-muted-foreground">
                        © 2024 Eunnikoo Coffee Shop. All rights reserved.
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Footer1;
