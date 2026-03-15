'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const supabase = createClient();

interface Screenshot {
  id: number;
  image_url: string;
  tagline: string;
  created_at: string;
}

interface UploadQueueItem {
  file: File;
  preview: string;
  tagline: string;
}

export default function ScreenshotsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchScreenshots();
  }, []);

  const fetchScreenshots = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('screenshots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching screenshots:', error);
    } else {
      setScreenshots(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      uploadQueue.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [uploadQueue]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    const newItems: UploadQueueItem[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      tagline: '',
    }));

    setUploadQueue((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const handleTaglineChange = (index: number, value: string) => {
    setUploadQueue((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, tagline: value } : item
      )
    );
  };

  const removeFromQueue = (index: number) => {
    setUploadQueue((prev) => {
      const item = prev[index];
      URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (uploadQueue.length === 0) return;

    const missingTagline = uploadQueue.some((i) => !i.tagline.trim());
    if (missingTagline) {
      alert('Please provide a tagline for each screenshot.');
      return;
    }

    setUploading(true);

    try {
      for (const item of uploadQueue) {
        const fileName = `${Date.now()}_${item.file.name.replace(/\s+/g, '_')}`;

        const { error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(fileName, item.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('screenshots')
          .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;

        const { error: dbError } = await supabase
          .from('screenshots')
          .insert([{ image_url: imageUrl, tagline: item.tagline }]);

        if (dbError) throw dbError;
      }

      setUploadQueue([]);
      await fetchScreenshots();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Screenshot Gallery
      </h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the images here...</p>
        ) : (
          <p className="text-gray-600">
            Drag & drop screenshots here, or click to select files
          </p>
        )}
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ready to upload</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadQueue.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 bg-white shadow"
              >
                <div className="relative aspect-video mb-2">
                  <Image
                    src={item.preview}
                    alt="preview"
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tagline"
                  value={item.tagline}
                  onChange={(e) =>
                    handleTaglineChange(index, e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                />

                <button
                  onClick={() => removeFromQueue(index)}
                  className="mt-1 text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {uploading
              ? 'Uploading...'
              : `Upload ${uploadQueue.length} image(s)`}
          </button>
        </div>
      )}

      {/* Existing Screenshots */}
      {loading ? (
        <div className="flex justify-center min-h-[40vh] items-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        </div>
      ) : screenshots.length === 0 ? (
        <p className="text-center text-gray-500">
          No screenshots yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-video">
                <Image
                  src={screenshot.image_url}
                  alt={screenshot.tagline}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="p-3 text-center">
                <p className="text-sm font-medium text-gray-800">
                  {screenshot.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}