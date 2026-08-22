import React, { useState } from 'react';
import { X, Phone, MessageSquare, Mail, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContactPosterModal = ({ isOpen, onClose, item }) => {
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [proofDetails, setProofDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const poster = item.postedBy;
  const contactPhone = item.contactPhone || poster?.phone;
  const contactEmail = item.contactEmail || poster?.email;
  const whatsappNumber = poster?.whatsapp || contactPhone;

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to send an in-app claim message');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await userAPI.submitClaim({
        itemId: item._id,
        message,
        contactPhone: phone,
        proofDetails,
      });
      setSentSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Contact Poster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Regarding: <span className="font-semibold text-slate-700">{item.title}</span>
          </p>
        </div>

        {/* Direct Contact Buttons */}
        <div className="space-y-2.5 mb-6">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%2C%20I%20am%20contacting%20you%20regarding%20the%20${encodeURIComponent(
                item.title
              )}%20on%20CampusFind.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </div>
              <span className="text-xs font-normal text-emerald-700">{whatsappNumber}</span>
            </a>
          )}

          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-between p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Directly</span>
              </div>
              <span className="text-xs font-normal text-blue-700">{contactPhone}</span>
            </a>
          )}

          {contactEmail && (
            <a
              href={`mailto:${contactEmail}?subject=CampusFind:%20Inquiry%20about%20${encodeURIComponent(
                item.title
              )}`}
              className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Send Email</span>
              </div>
              <span className="text-xs font-normal text-indigo-700 truncate max-w-[180px]">
                {contactEmail}
              </span>
            </a>
          )}
        </div>

        {/* In-app claim message form */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Or Send In-App Claim Message
          </h4>

          {sentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-emerald-900">
                Message Sent Successfully!
              </p>
              <p className="text-xs text-emerald-700">
                The poster has been notified and can reach out to you directly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim} className="space-y-3">
              {error && (
                <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Identification Details
                </label>
                <textarea
                  rows="3"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your claim, unique identifiers, or when you can meet..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message to Poster'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPosterModal;
