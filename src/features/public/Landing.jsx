import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Landing = () => {
    return (
        <div className="flex flex-col w-full">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card border-b">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary">
                                Uncompromising Style.
                            </h1>
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                Everyday Comfort.
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Premium streetwear essentials crafted for exactly who you are. Discover our latest collection.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button asChild size="lg" className="px-8 flex-1">
                                <Link to="/products">Shop Collection</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Featured Categories</h2>
                        <p className="max-w-[900px] text-muted-foreground">
                            Find exactly what fits your vibe.
                        </p>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                        {[
                            { title: 'Streetwear', bg: 'bg-primary/10', color: 'text-primary' },
                            { title: 'Classic', bg: 'bg-accent/10', color: 'text-accent' },
                            { title: 'Premium', bg: 'bg-secondary/50', color: 'text-secondary-foreground' }
                        ].map(cat => (
                            <Card key={cat.title} className={`${cat.bg} border-0 shadow-none hover:scale-105 transition-transform cursor-pointer`}>
                                <CardHeader className="text-center">
                                    <CardTitle className={`text-2xl ${cat.color}`}>{cat.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <Button variant="link" asChild className="text-foreground">
                                        <Link to={`/products?category=${cat.title}`}>Browse {cat.title}</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
