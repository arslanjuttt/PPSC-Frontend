"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, getApiErrorMessage } from "@/lib/api";
import { User, Mail, Calendar, Award, Zap, Target, Trophy, Pencil, Save, X, MapPin, Phone } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    refreshUser().catch(() => {});
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone: user.phone || "",
        city: user.city || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const profileStats = [
    { label: "Current Streak", value: `${user.profile?.streak || 0} days`, icon: Zap, color: "from-yellow-400 to-orange-500" },
    { label: "Tests Completed", value: user.profile?.totalTests || 0, icon: Target, color: "from-green-400 to-emerald-500" },
    { label: "Last Score", value: `${user.profile?.lastScore || 0}%`, icon: Trophy, color: "from-blue-400 to-cyan-500" },
    { label: "Accuracy", value: `${user.profile?.accuracy || 0}%`, icon: Award, color: "from-purple-400 to-pink-500" },
  ];

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsSaving(true);
    try {
      await userApi.updateProfile(form);
      await refreshUser();
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-white/90 text-lg">
              {user.isEmailVerified ? 'Email verified' : 'Please verify your email'}
            </p>
          </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
      {success && <div className="text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">{success}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <User className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
              {isEditing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              {isEditing ? (
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.phone || "—"}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">City</p>
              {isEditing ? (
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.city || "—"}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profileStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className={`p-3 bg-linear-to-r ${stat.color} rounded-lg w-fit mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</h3>
                <p className={`text-3xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
