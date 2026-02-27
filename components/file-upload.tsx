"use client";

import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import type { ApiResponse } from "@/lib/api-response";

type FileUploadProps = {
  onUploadSuccess: (url: string) => void;
};

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLastUploaded(null);

    setIsUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as ApiResponse<string[]>;

      if (payload.code !== 200 || !payload.data?.length) {
        setError(payload.message || "上传失败。");
        return;
      }

      onUploadSuccess(payload.data[0]);
      setLastUploaded(file.name);
    } catch {
      setError("文件上传失败，请重试。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border p-3">
      <Input
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          void handleUpload(file);
        }}
      />
      {isUploading ? <p className="text-sm text-muted-foreground">图片上传中...</p> : null}
      {!isUploading && lastUploaded ? (
        <p className="text-sm text-muted-foreground">已上传：{lastUploaded}</p>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>上传失败</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
