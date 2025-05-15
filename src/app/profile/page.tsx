"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  // Change password state
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
      setAvatarUrl(session.user.image || null);
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
      } else {
        setSuccess("Profile updated successfully!");
        // Optionally, update session data here (requires re-fetch or signIn('credentials', ...))
        setEditMode(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError("");
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setAvatarError(data.error || "Failed to upload avatar");
      } else {
        setAvatarUrl(data.avatarUrl);
        setSuccess("Avatar updated!");
        // Refresh session to update avatar everywhere
        if (typeof update === 'function') {
          await update();
        }
      }
    } catch (err) {
      setAvatarError("Something went wrong. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError("New passwords do not match");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Failed to change password");
      } else {
        setPwSuccess("Password changed successfully!");
        setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      }
    } catch (err) {
      setPwError("Something went wrong. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center py-8 px-4 sm:px-6 min-h-[70vh]">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-muted-foreground">👤</span>
                )}
              </div>
              {/* Avatar upload */}
              <label className="mt-1">
                <span className="sr-only">Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </label>
              {avatarUploading && <div className="text-xs text-muted-foreground">Uploading...</div>}
              {avatarError && <div className="text-xs text-destructive">{avatarError}</div>}
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {success && (
                <div className="rounded-md bg-green-100 p-3 text-sm text-green-700">{success}</div>
              )}
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode || isSaving}
                  className="h-11 text-base"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode || isSaving}
                  className="h-11 text-base"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="flex gap-2 mt-4">
                {editMode ? (
                  <>
                    <Button type="submit" className="h-11 min-w-[44px] px-4" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditMode(false)} className="h-11 min-w-[44px] px-4" disabled={isSaving}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setEditMode(true)} className="h-11 min-w-[44px] px-4">Edit Profile</Button>
                )}
              </div>
            </form>
            {/* Change Password section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Change Password</h2>
              <form onSubmit={handlePwSubmit} className="space-y-3 max-w-md">
                {pwSuccess && <div className="rounded-md bg-green-100 p-3 text-sm text-green-700">{pwSuccess}</div>}
                {pwError && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{pwError}</div>}
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={pwForm.currentPassword}
                    onChange={handlePwChange}
                    required
                    disabled={pwLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={pwForm.newPassword}
                    onChange={handlePwChange}
                    required
                    minLength={8}
                    disabled={pwLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    value={pwForm.confirmNewPassword}
                    onChange={handlePwChange}
                    required
                    minLength={8}
                    disabled={pwLoading}
                  />
                </div>
                <Button type="submit" className="mt-2 h-11 min-w-[44px] px-4" disabled={pwLoading}>
                  {pwLoading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 