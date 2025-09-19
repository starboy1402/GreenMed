import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, Users, Lightbulb } from 'lucide-react';

const AboutPage: React.FC = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const coreValues = [
        {
            icon: Leaf,
            title: "Sustainability",
            description: "Championing eco-friendly practices to nurture the planet."
        },
        {
            icon: Users,
            title: "Community",
            description: "Building connections among plant enthusiasts and experts."
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "Delivering smart tools for modern plant care."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-medium">
                                <Leaf className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Welcome to{' '}
                            <span className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                                GreenMed
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            GreenMed is your go-to digital hub for plant lovers, gardeners, farmers, and sellers. Whether you're nurturing your first seedling or managing a thriving nursery, our platform makes plant care effortless, educational, and inspiring.
                        </p>

                        <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                            Browse our curated e-commerce marketplace for premium plants and gardening tools, connect with plant experts for tailored advice, and diagnose issues with cutting-edge tools. GreenMed brings together a passionate community to share knowledge and promote sustainable practices, helping you grow greener, healthier plants.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Our Core Values
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {coreValues.map((value, index) => (
                        <Card
                            key={index}
                            className={`text-center transition-all duration-300 hover:shadow-medium ${hoveredCard === index ? 'transform scale-105' : ''
                                }`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardContent className="p-8">
                                <div className="flex justify-center mb-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                                        <value.icon className="h-8 w-8 text-primary-foreground" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-foreground mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {value.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Vision Section */}
            <div className="bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            Our Vision
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                            We dream of a world where every plant thrives and every grower feels empowered. GreenMed is committed to making plant care accessible, joyful, and sustainable for all, fostering a greener future one leaf at a time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Community Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Our Community
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                        Join a vibrant network of plant enthusiasts, botanists, and growers. Share your passion, learn from experts, and inspire others to cultivate their green spaces with GreenMed.
                    </p>

                    <Button
                        size="lg"
                        className="bg-gradient-primary hover:bg-gradient-nature transition-smooth"
                        onMouseEnter={() => setHoveredCard(3)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        Join Our Community 🌱
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;