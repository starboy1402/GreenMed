import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
        id: string;
        name: string;
    };
}

const SellerReviewPage = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });
    const { toast } = useToast();
    const { user, userType } = useAuth();

    useEffect(() => {
        if (sellerId) {
            fetchReviews();
        }
    }, [sellerId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/reviews/seller/${sellerId}`);
            setReviews(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load reviews.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async () => {
        if (!sellerId) return;

        try {
            setSubmitting(true);
            await api.post('/reviews', {
                sellerId: parseInt(sellerId),
                rating: newReview.rating,
                comment: newReview.comment
            });

            toast({
                title: "Success",
                description: "Review submitted successfully.",
            });

            setNewReview({ rating: 5, comment: '' });
            setShowReviewForm(false);
            fetchReviews(); // Refresh reviews
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit review.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading reviews...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/sellers">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sellers
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Seller Reviews</h1>
                    <p className="text-muted-foreground">Customer feedback and ratings</p>
                </div>
            </div>

            {/* Rating Summary */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                            <div className="flex justify-center mb-1">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        {userType === 'customer' && !showReviewForm && (
                            <Button onClick={() => setShowReviewForm(true)}>
                                Write a Review
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Review Form */}
            {showReviewForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Rating</Label>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`h-6 w-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your experience with this seller..."
                                rows={4}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={submitReview} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-muted-foreground">No reviews yet. Be the first to review this seller!</p>
                        </CardContent>
                    </Card>
                ) : (
                    reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold">{review.reviewer.name}</span>
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default SellerReviewPage;