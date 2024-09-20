import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const people = [
    {
        id: 'person-1',
        name: 'Neeko',
        role: 'Co-Founder',
        avatar: 'https://www.shadcnblocks.com/images/block/avatar-7.webp',
    },
    {
        id: 'person-2',
        name: 'Icey',
        role: 'Co-Founder',
        avatar: 'https://www.shadcnblocks.com/images/block/avatar-3.webp',
    },
    {
        id: 'person-3',
        name: 'Didi',
        role: 'Financial Expert',
        avatar: 'https://www.shadcnblocks.com/images/block/avatar-5.webp',
    },
    {
        id: 'person-4',
        name: 'Edward',
        role: 'IT Support',
        avatar: 'https://www.shadcnblocks.com/images/block/avatar-2.webp',
    }
];

const Team = () => {
    return (
        <section className="py-16 px-4">
            <div className="container flex flex-col items-center text-center mx-auto">
                <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
                    Meet our team
                </h2>
                <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
                    Our team is a passionate group of coffee enthusiasts, artists, and dreamers who share a common goal: to bring a little magic into your everyday life.
                </p>
            </div>
            <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4 mx-auto">
                {people.map((person) => (
                    <div key={person.id} className="flex flex-col items-center">
                        <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
                            <AvatarImage src={person.avatar} />
                            <AvatarFallback>{person.name}</AvatarFallback>
                        </Avatar>
                        <p className="text-center font-medium">{person.name}</p>
                        <p className="text-center text-muted-foreground">{person.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Team;
