import { WandSparkles, Sprout, Sofa, Coffee } from 'lucide-react';

const Feature = () => {
    return (
        <section className="flex justify-center py-16 px-4">
            <div className="container">
                <p className="mb-4 text-xs text-muted-foreground">Why Us?</p>
                <h2 className="text-3xl font-medium lg:text-4xl">
                    A lot you can get here
                </h2>
                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                    <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <WandSparkles className="size-5 md:size-6" />
            </span>
                        <div>
                            <h3 className="font-medium md:mb-2 md:text-xl">
                                Unique and Magical Blends
                                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
                            </h3>
                            <p className="text-sm text-muted-foreground md:text-base">
                                Every sip is a magical experience, designed to brighten your day and awaken your senses.
                            </p>
                        </div>
                    </div>
                    <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Sprout className="size-5 md:size-6" />
            </span>
                        <div>
                            <h3 className="font-medium md:mb-2 md:text-xl">
                                Sustainability with Every Sip
                                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
                            </h3>
                            <p className="text-sm text-muted-foreground md:text-base">
                                We source our coffee beans from fair trade farms that prioritize sustainability and ethical practices.
                            </p>
                        </div>
                    </div>
                    <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Sofa className="size-5 md:size-6" />
            </span>
                        <div>
                            <h3 className="font-medium md:mb-2 md:text-xl">
                                A Space to Dream
                                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
                            </h3>
                            <p className="text-sm text-muted-foreground md:text-base">
                                Our café is designed to be a cozy and inspiring space where you can unwind, work, or simply enjoy the moment.
                            </p>
                        </div>
                    </div>
                    <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Coffee className="size-5 md:size-6" />
            </span>
                        <div>
                            <h3 className="font-medium md:mb-2 md:text-xl">
                                Craftsmanship in Every Cup
                                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
                            </h3>
                            <p className="text-sm text-muted-foreground md:text-base">
                                Trained to perfection, they pour their passion into every cup.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Feature;
