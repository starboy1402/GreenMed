import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle, Globe, Facebook, Twitter, Instagram } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Us",
            description: "Get in touch via email",
            contact: "u2204053@students.cuet.ac.bd"
        },
        {
            icon: Phone,
            title: "Call Us",
            description: "Speak directly with our team",
            contact: "01728575232"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            description: "Come to our office",
            contact: "Cuet, Chittagong"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Chat with us online",
            contact: "Available 24/7"
        }
    ];

    const socialLinks = [
        { icon: Globe, platform: "Website", url: "#" },
        { icon: Facebook, platform: "Facebook", url: "https://www.facebook.com/ayan.barua.12177" },
        { icon: Twitter, platform: "Twitter", url: "#" },
        { icon: Instagram, platform: "Instagram", url: "#" }
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-medium">
                                <Mail className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Get In Touch With Us
                            <span className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-2xl mx-auto">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {contactMethods.map((method, index) => (
                                    <Card
                                        key={index}
                                        className={`transition-all duration-300 hover:shadow-medium cursor-pointer ${hoveredCard === index ? 'transform scale-105' : ''
                                            }`}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary flex-shrink-0">
                                                    <method.icon className="h-6 w-6 text-primary-foreground" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-foreground mb-1">
                                                        {method.title}
                                                    </h3>
                                                    <p className="text-muted-foreground mb-2">
                                                        {method.description}
                                                    </p>
                                                    <p className="text-primary font-medium">
                                                        {method.contact}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                                Follow Us
                            </h3>
                            <div className="flex justify-center space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground hover:bg-gradient-nature transition-smooth"
                                        title={social.platform}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;