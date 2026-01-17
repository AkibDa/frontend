"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { auth } from "@/firebaseConfig";
import api from "@/services/api";

interface AddStaffModalProps {
  onClose: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddStaff = async () => {
    if (!email) {
      setError("Please enter an email");
      return;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      await api.post(
        "/staff/add-member",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Staff invite sent successfully");
      setEmail("");
      // Optional: Close modal automatically after success
      // setTimeout(onClose, 2000); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Staff Email Address
        </label>
        <input
            type="email"
            placeholder="staff@tint.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium">
            {success}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAddStaff}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-black text-white flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
        >
          {loading ? (
             "Adding..." 
          ) : (
            <>
                <UserPlus size={16} />
                Add Member
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddStaffModal;