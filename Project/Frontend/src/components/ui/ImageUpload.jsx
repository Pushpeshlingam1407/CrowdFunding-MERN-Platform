import React, { useRef, useState } from "react";
import { Button } from "./index";

const ImageUpload = ({
  label,
  value, // file object or URL string
  onChange,
  onRemove,
  multiple = false,
  accept = "image/*",
  disabled = false,
  maxSizeMB = 5,
  existingImages = [],
  onDeleteExisting,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const handleClickZone = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds ${maxSizeMB}MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (multiple) {
      onChange(validFiles);
    } else {
      onChange(validFiles[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getImgSrc = (val) => {
    if (val instanceof File) {
      return URL.createObjectURL(val);
    }
    if (typeof val === "string") {
      return val.startsWith("http")
        ? val
        : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://localhost:5000"}${val}`;
    }
    return "";
  };

  return (
    <div className="img-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden-input"
        disabled={disabled}
      />

      {/* Single image preview style */}
      {!multiple && value && (
        <div className="img-single-preview-wrapper">
          <img src={getImgSrc(value)} alt="Preview" />
          {!disabled && (
            <div className="img-single-metadata-overlay">
              <div className="text-info">
                <h4>{value instanceof File ? value.name : "Cover Image"}</h4>
                <p>
                  {value instanceof File
                    ? formatFileSize(value.size)
                    : "Uploaded"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onRemove}
                className="image-upload-change-btn"
              >
                Change Photo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dropzone area (rendered if multiple, or if single and no value is selected) */}
      {(multiple || !value) && (
        <div
          className={`img-drop-zone ${isDragging ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
          onClick={handleClickZone}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload
            size={36}
            className={`upload-icon ${isDragging ? "upload-icon-dragging" : "upload-icon-idle"}`}
          />
          <p className="img-info-text">
            {isDragging
              ? "Drop your files here"
              : `Drag & drop your ${multiple ? "images" : "image"} here`}
          </p>
          <p className="img-sub-text">
            {!isDragging && (
              <>
                or <span className="browse-link">browse files</span> from your
                computer
              </>
            )}
          </p>
          <p className="image-upload-subtext-note">
            Supports JPG, PNG, WEBP · Max {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Grid previews for multiple/gallery uploads */}
      {multiple &&
        (existingImages.length > 0 ||
          (Array.isArray(value) && value.length > 0)) && (
          <div className="image-upload-gallery-wrapper">
            <p className="gallery-label">
              Gallery Images (
              {existingImages.length +
                (Array.isArray(value) ? value.length : 0)}
              )
            </p>

            <div className="img-preview-grid">
              {/* Existing Uploaded Images */}
              {existingImages.map((imgUrl, idx) => (
                <div key={`existing-${idx}`} className="img-preview-card">
                  <img src={getImgSrc(imgUrl)} alt={`Existing ${idx}`} />
                  {!disabled && onDeleteExisting && (
                    <button
                      type="button"
                      className="img-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteExisting(imgUrl);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {/* New Selected Images */}
              {Array.isArray(value) &&
                value.map((file, idx) => (
                  <div key={`new-${idx}`} className="img-preview-card">
                    <img src={getImgSrc(file)} alt={`New ${idx}`} />
                    {!disabled && onRemove && (
                      <button
                        type="button"
                        className="img-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(idx);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ImageUpload;
