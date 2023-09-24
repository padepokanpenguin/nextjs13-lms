"use client";

import toast from "react-hot-toast";

import {  UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "../../app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({
  onChange,
  endpoint
}: FileUploadProps) => {
  return (
    <>
        {/* <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
            }}
        /> */}
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log(res)
                onChange(res?.[0].url);
            }}
            onUploadBegin={() => {
                console.log("upload begin");
                }}
            onUploadError={(error: Error) => {
                console.log(error.message)
                toast.error(`${error?.message}`);
            }}
        />
    </>
  )
}