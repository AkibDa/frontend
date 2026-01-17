"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, X, Check, Shield, User, AlertCircle } from "lucide-react";
import { auth } from "@/firebaseConfig";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface ManageTeamModalProps {
  onClose: () => void;
}

interface StaffMember {
  uid: string;
  email: string;
  role: "manager" | "staff";
  status: string;
}

const ManageTeamModal: React.FC<ManageTeamModalProps> = ({ onClose }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI Feedback State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchStaff = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await api.get("/staff/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const list = Array.isArray(res.data) ? res.data : res.data.staff || [];
      setStaffList(list);
    } catch (err) {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;

    setActionLoading(true);
    setFeedback(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.delete(`/staff/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setStaffList((prev) => prev.filter((s) => s.uid !== uid));
      setFeedback({ type: 'success', message: "Staff member removed successfully." });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || "Failed to remove staff." });
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (staff: StaffMember) => {
    setEditingId(staff.uid);
    setEditEmail(staff.email);
    setFeedback(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditEmail("");
  };

  const saveEdit = async (uid: string) => {
    if (!editEmail.includes("@")) {
      setFeedback({ type: 'error', message: "Please enter a valid email." });
      return;
    }

    setActionLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.put(
        `/staff/${uid}/email`,
        { new_email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStaffList((prev) =>
        prev.map((s) => (s.uid === uid ? { ...s, email: editEmail } : s))
      );
      setEditingId(null);
      setFeedback({ type: 'success', message: "Email updated successfully." });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || "Failed to update email." });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <h3 style={{ fontFamily: "Geom" }} className="text-xl font-bold text-gray-900">
          Manage Team
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>
      </div>

      {/* Dynamic Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`px-6 py-2 text-sm font-medium flex items-center gap-2 overflow-hidden ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
             {feedback.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
             {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable List */}
      <div className="overflow-y-auto p-6 max-h-[60vh] min-h-[150px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading team...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No staff members found.</div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {staffList.map((staff) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={staff.uid}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${staff.role === 'manager' ? 'bg-black' : 'bg-emerald-500'}`}>
                      {staff.role === 'manager' ? <Shield size={16} /> : <User size={16} />}
                    </div>
                    
                    <div className="min-w-0 flex-1 mr-2">
                      {editingId === staff.uid ? (
                        <input 
                          className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          autoFocus
                          placeholder="Enter new email"
                        />
                      ) : (
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {staff.email}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-md">
                          {staff.role}
                        </span>
                        <span className={`text-[10px] font-medium ${staff.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {staff.status === 'active' ? '• Active' : '• Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 pl-2">
                    {editingId === staff.uid ? (
                      <>
                        <button 
                          onClick={() => saveEdit(staff.uid)}
                          disabled={actionLoading}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={cancelEdit}
                          disabled={actionLoading}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(staff)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Email"
                        >
                          <Edit2 size={14} />
                        </button>
                        
                        {staff.role !== 'manager' && (
                          <button 
                            onClick={() => handleDelete(staff.uid)}
                            disabled={actionLoading}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Remove Staff"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeamModal;