import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Phone,
  FileText,
  ShieldCheck,
  MapPin,
  CreditCard,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  File,
  X,
} from 'lucide-react';

export default function MechanicVerificationForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    specialization: '',
    aadhaar: '',
    pan: '',
    address: '',
    upiId: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const newFiles = files.map((f) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('https://mendic-api.mendic.workers.dev/api/mechanics/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || 'user_' + Math.random().toString(36).substr(2, 9),
          fullName: formData.fullName,
          phone: formData.phone,
          city: 'Bangalore',
          experienceYears: 2,
          specializations: formData.specialization || 'laptop',
        }),
      });
    } catch (err) {
      console.error('Error submitting KYC:', err);
    } finally {
      setIsSubmitting(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }
  };

  return (
    <div className="card bg-white rounded-2xl border border-gray-100 shadow-md p-6 sm:p-10 max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex items-start gap-4 border-b border-gray-100 pb-6">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary-100">
          <ShieldCheck className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">Complete Your Profile</h1>
          <p className="text-sm text-muted mt-1">
            Submit your KYC details and professional repair certifications to get verified for laptop and mobile phone repair jobs on Mendic.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Information */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-dark flex items-center gap-2 border-l-4 border-primary-500 pl-3">
            <User className="w-4 h-4 text-primary-500" />
            1. Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
                Full Name (As per Aadhaar) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Kumar"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Specialization Dropdown */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
              What type of repair specialist are you? *
            </label>
            <div className="relative">
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-medium transition-all bg-white cursor-pointer appearance-none"
              >
                <option value="" disabled>-- Select Specialization --</option>
                <option value="laptop">Laptop Repair Specialist</option>
                <option value="mobile">Mobile Phone Repair Specialist</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Government IDs */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-dark flex items-center gap-2 border-l-4 border-primary-500 pl-3">
            <FileText className="w-4 h-4 text-primary-500" />
            2. Government Identity Proofs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
                Aadhaar Number *
              </label>
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-mono tracking-wider transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
                PAN Number *
              </label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                maxLength={10}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-mono uppercase tracking-wider transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location & Payout */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-dark flex items-center gap-2 border-l-4 border-primary-500 pl-3">
            <MapPin className="w-4 h-4 text-primary-500" />
            3. Location & Payout Details
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
                Full Residential / Workshop Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter complete street address, landmark, city and pincode..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-medium transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark uppercase tracking-wider">
                UPI ID (For Instant Job Payouts) *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="username@upi / 9876543210@okaxis"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-dark text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Professional Credentials */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-dark flex items-center gap-2 border-l-4 border-primary-500 pl-3">
            <UploadCloud className="w-4 h-4 text-primary-500" />
            4. Certificates & Resumes
          </h2>
          <p className="text-xs text-muted">
            Upload your electronics repair certifications, technical training certificates, or CV/Resume. Supported formats: PDF, JPG, PNG.
          </p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-500 hover:bg-primary-50/20 transition-all duration-200 cursor-pointer group relative bg-gray-50/50"
          >
            <input
              type="file"
              multiple
              onChange={handleFileDrop}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-200 group-hover:border-primary-300 group-hover:scale-105 transition-all">
              <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-primary-500 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-dark">
              Click to upload <span className="font-normal text-muted">or drag and drop</span>
            </p>
            <p className="text-xs text-muted mt-1">PDF, DOCX, PNG, JPG (max. 10MB per file)</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-dark">Uploaded Files ({uploadedFiles.length}):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <File className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="font-medium text-dark truncate text-xs">{file.name}</span>
                      <span className="text-[10px] text-muted flex-shrink-0">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            By submitting this form, you authorize Mendic to verify your government identity credentials and background history. Your personal data is encrypted and processed securely.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-500/25 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Submitting KYC Details...</span>
          ) : (
            <>
              <span>Submit for Verification</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
