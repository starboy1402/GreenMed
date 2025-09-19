import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, User, Leaf, ShoppingCart, MessageSquare, Truck, ChevronDown, ChevronRight } from 'lucide-react';

const FAQPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const faqData = [
        {
            id: '1',
            category: 'account',
            question: "How do I create an account?",
            answer: "Click the 'Sign Up' button in the top navigation. Fill in your details including name, email, and password. You'll receive a confirmation email to verify your account."
        },
        {
            id: '2',
            category: 'account',
            question: "How do I reset my password?",
            answer: "Click 'Forgot Password' on the login page. Enter your email address and we'll send you a reset link. Follow the instructions in the email to create a new password."
        },
        {
            id: '3',
            category: 'plants',
            question: "How do I identify plant diseases?",
            answer: "Use our AI-powered disease detection tool on the Plants page. Upload a photo of your plant, and our system will analyze it and suggest treatments and medicines."
        },
        {
            id: '4',
            category: 'plants',
            question: "What types of plants do you offer?",
            answer: "We offer a wide variety of tropical and ornamental plants. You can browse by category on the Explore Shop page or search for specific plants using our search feature."
        },
        {
            id: '5',
            category: 'shopping',
            question: "How do I order medicines for my plants?",
            answer: "On the Plants page, each plant lists common diseases and recommended medicines. Select your quantity and click 'Add to Cart'. Your cart is saved and accessible from your profile."
        },
        {
            id: '6',
            category: 'shopping',
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
        },
        {
            id: '7',
            category: 'support',
            question: "How can I contact customer support?",
            answer: "You can reach us via email at support@greenmed.com, phone at (123) 456-7890, or through our live chat feature. We're available 24/7 to help!"
        },
        {
            id: '8',
            category: 'support',
            question: "Do you offer refunds?",
            answer: "Yes, we offer a 30-day refund policy on all purchases. Contact our support team with your order number to initiate a refund request."
        },
        {
            id: '9',
            category: 'shipping',
            question: "Do you ship internationally?",
            answer: "Currently, we ship to select regions. Please contact our support team to confirm if we can deliver to your location and discuss shipping costs."
        },
        {
            id: '10',
            category: 'shipping',
            question: "How long does shipping take?",
            answer: "Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 business days depending on your location."
        }
    ];

    const categories = [
        { id: 'all', name: 'All Questions', icon: HelpCircle },
        { id: 'account', name: 'Account', icon: User },
        { id: 'plants', name: 'Plants & Care', icon: Leaf },
        { id: 'shopping', name: 'Shopping', icon: ShoppingCart },
        { id: 'support', name: 'Support', icon: MessageSquare },
        { id: 'shipping', name: 'Shipping', icon: Truck }
    ];

    const filteredFAQs = useMemo(() => {
        return faqData.filter(faq => {
            const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
            const matchesSearch = searchTerm === '' ||
                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    const toggleFAQ = (id: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-medium">
                                <HelpCircle className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Help Center
                            <span className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                                FAQ
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Find answers to frequently asked questions or search for what you need
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 text-lg rounded-full border-2 focus:border-primary transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeCategory === category.id
                                    ? 'bg-gradient-primary hover:bg-gradient-nature shadow-medium'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            <category.icon className="h-4 w-4" />
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* FAQ Content */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
                {filteredFAQs.length > 0 ? (
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <Card
                                key={faq.id}
                                className="shadow-medium hover:shadow-lg transition-all duration-300"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardContent className="p-0">
                                    <Button
                                        variant="ghost"
                                        className="w-full p-6 text-left justify-between hover:bg-muted/50 transition-all duration-300"
                                        onClick={() => toggleFAQ(faq.id)}
                                    >
                                        <span className="text-lg font-semibold text-foreground">
                                            {faq.question}
                                        </span>
                                        {openItems.has(faq.id) ? (
                                            <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                                        )}
                                    </Button>
                                    {openItems.has(faq.id) && (
                                        <div className="px-6 pb-6">
                                            <p className="text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="shadow-medium">
                        <CardContent className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                                    <Search className="h-6 w-6 text-primary-foreground" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                No results found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                We couldn't find any FAQs matching your search. Try different keywords or browse by category.
                            </p>
                            <Button className="bg-gradient-primary hover:bg-gradient-nature transition-smooth">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FAQPage;