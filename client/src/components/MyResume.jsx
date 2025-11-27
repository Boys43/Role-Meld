import axios from "axios";
import React, { useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Loader, Upload, FileText, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';

// Import styles
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const MyResume = () => {
    const { backendUrl, userData, setUserData } = useContext(AppContext);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

    // PDF State
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [pdfError, setPdfError] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPdfError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        setPdfError("Failed to load PDF. Please try downloading it instead.");
    };

    const changeResume = async (resume) => {
        if (!resume) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(resume.type)) {
            toast.error('Please upload a PDF or Word document');
            return;
        }

        // Validate file size (5MB)
        if (resume.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);
        setUploading(true);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/updateresume`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (data.success) {
                setUserData(data.profile);
                toast.success(data.message);
                setPageNumber(1); // Reset page on new upload
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) changeResume(file);
    };

    const isPDF = userData?.resume?.endsWith(".pdf");
    const isWordDoc = userData?.resume?.endsWith(".docx") || userData?.resume?.endsWith(".doc");

    return (
        <div className="min-h-[calc(100vh-80px)] p-6 w-full bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-[var(--primary-color)]" />
                    My Resume
                </h2>

                {/* Resume Preview Section */}
                {userData?.resume && (
                    <div className="mb-8">
                        {/* Resume Info Card */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <FileText className="w-8 h-8 text-[var(--primary-color)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {userData.resume.split("/").pop()}
                                    </h3>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {isPDF ? "PDF Document" : isWordDoc ? "Word Document" : "Document"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href={userData.resume}
                                    download
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                                <a
                                    href={userData.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    View Full
                                </a>
                            </div>
                        </div>

                        {/* PDF Preview with react-pdf */}
                        {isPDF && (
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                            disabled={pageNumber <= 1}
                                            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm font-medium text-gray-700">
                                            Page {pageNumber} of {numPages || '--'}
                                        </span>
                                        <button
                                            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                                            disabled={pageNumber >= (numPages || 1)}
                                            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                                            className="p-1.5 rounded-md hover:bg-gray-200 text-gray-700"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm font-medium text-gray-700 w-12 text-center">
                                            {Math.round(scale * 100)}%
                                        </span>
                                        <button
                                            onClick={() => setScale(prev => Math.min(prev + 0.1, 2.0))}
                                            className="p-1.5 rounded-md hover:bg-gray-200 text-gray-700"
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Document Viewer */}
                                <div className="flex justify-center bg-gray-100 p-4 min-h-[500px] overflow-auto">
                                    {pdfError ? (
                                        <div className="flex flex-col items-center justify-center text-gray-500 h-64">
                                            <p>{pdfError}</p>
                                        </div>
                                    ) : (
                                        <Document
                                            file={userData.resume}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            onLoadError={onDocumentLoadError}
                                            loading={
                                                <div className="flex items-center gap-2 text-gray-500 h-64">
                                                    <Loader className="w-6 h-6 animate-spin" />
                                                    <span>Loading PDF...</span>
                                                </div>
                                            }
                                            className="shadow-lg"
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                scale={scale}
                                                renderTextLayer={true}
                                                renderAnnotationLayer={true}
                                                className="bg-white"
                                            />
                                        </Document>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Word Document Notice */}
                        {isWordDoc && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                                <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Word Document Uploaded
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Preview is not available for Word documents directly in the browser. Please download the file to view it.
                                </p>
                                <a
                                    href={userData.resume}
                                    download
                                    className="inline-flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Document
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        {userData?.resume ? 'Update Resume' : 'Upload Resume'}
                    </h3>

                    <div
                        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${dragOver
                            ? "border-[var(--primary-color)] bg-blue-50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                        }}
                        onDrop={handleDrop}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <Loader className="w-12 h-12 animate-spin text-[var(--primary-color)]" />
                                <span className="text-lg font-medium text-gray-700">Uploading your resume...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-blue-50 rounded-full">
                                    <Upload className="w-10 h-10 text-[var(--primary-color)]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-semibold text-gray-800 mb-2">
                                        Drag & drop your resume here
                                    </p>
                                    <p className="text-gray-500">
                                        or click to browse from your computer
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
                                    <span className="bg-gray-100 px-2 py-1 rounded">PDF</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">DOC</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">DOCX</span>
                                    <span>Max 5MB</span>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => changeResume(e.target.files[0])}
                            disabled={uploading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyResume;
