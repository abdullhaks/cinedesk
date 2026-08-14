import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { onboardingApi } from '../../services/apis/onboardingApi';

interface FileUploadFieldProps {
  label: string;
  documentType: string;
  onUploadSuccess: (fileUrl: string, type: string) => void;
  acceptedTypes?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  documentType,
  onUploadSuccess,
  acceptedTypes = '.pdf,.png,.jpg,.jpeg',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await onboardingApi.uploadDocument(file);
      setUploadedUrl(res.fileUrl);
      setFileName(res.fileName);
      onUploadSuccess(res.fileUrl, documentType);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</span>
        {uploadedUrl && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            <CheckCircle size={14} /> Uploaded
          </span>
        )}
      </div>

      {!uploadedUrl ? (
        <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
          <Upload size={24} className="text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Accepted: PDF, PNG, JPG (Max 10MB)</span>
          <input
            type="file"
            accept={acceptedTypes}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <FileText size={16} className="text-blue-500" />
            <span className="truncate max-w-[200px]">{fileName}</span>
          </div>
          <label className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
            Replace
            <input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-xs text-rose-600 mt-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
