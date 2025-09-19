import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    userType: string;
    phoneNumber: string;
    address: string;
}

const AdminProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            setProfile(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load profile.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!profile) return;

        try {
            setSaving(true);
            await api.put('/users/profile', {
                name: profile.name,
                phoneNumber: profile.phoneNumber,
                address: profile.address,
            });
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (!profile) {
        return <div className="text-center">Profile not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Admin Profile</h1>
                <p className="text-muted-foreground">Manage your admin account information</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={profile.email}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={profile.phoneNumber || ''}
                                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="userType">User Type</Label>
                            <Input
                                id="userType"
                                value={profile.userType}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={profile.address || ''}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        ) : (
                            <>
                                <Button onClick={handleUpdate} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProfile;