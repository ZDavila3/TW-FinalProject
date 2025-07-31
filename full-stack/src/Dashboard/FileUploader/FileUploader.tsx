import { ChangeEvent, useState } from 'react';
import axios from 'axios';

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
            //testing file selection
            console.log('Selected file:', e.target.files[0]);
        }
    }

    async function handleUpload() {
        if (!file) return;

        setStatus("uploading");
        setUploadProgress(0); // Reset progress before upload

        const formData = new FormData();
        formData.append("file", file);

        try {
            //simulate file upload backend request
            await axios.post("https://httpbin.org/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total ? 
                        Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0; 
                    setUploadProgress(progress);
                }
            });
            setStatus("success");
            setUploadProgress(100); // Set progress to 100% on success
        } catch {
            setStatus("error");
            setUploadProgress(0); // Reset progress on error
            console.error("File upload failed");
        }
    }

    return (
        <div className="space-y-2">
            <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} />
            {file && (
                <div>
                    <p>Selected file: {file.name}</p>
                    <p>File size: {file.size} bytes</p>
                    <p>File type: {file.type}</p>
                </div>
            )}
            {file && status !== "uploading" && (
                <div className="space-y-2">
                    <div className="h-2.5 w-full bg-gray-200 rounded">
                        <div
                            className="h-full bg-blue-500 rounded transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500">Upload progress: {uploadProgress}%</p>
                    <button onClick={handleUpload}>Upload</button>
                </div>
            )}
            {status === "success" && (
                <p className="mt-2 text-green-500">File uploaded successfully!</p>
            )}
            {status === "error" && (
                <p className="mt-2 text-red-500">File upload failed. Please try again.</p>
            )}
        </div>
    );
}