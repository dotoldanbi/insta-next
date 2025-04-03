"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import Modal from "react-modal";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import supabase from "../supabase.js";
export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef();

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      console.log(file);
      console.log(imageFileUrl);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  async function uploadImageToStorage() {
    setImageFileUploading(true);

    const fileName = new Date().getTime() + "-" + selectedFile.name;
    // supabase
    const { data, error } = await supabase.storage
      .from("insta-next") // "images" 버킷에 업로드
      .upload(fileName, selectedFile);

    if (error) {
      console.error("Upload Fail:", error.message);
      alert("Upload Fail!");
    } else {
      console.log("Upload Success:", data);
      // url of uploaded image
      const { data: urlData } = supabase.storage
        .from("insta-next")
        .getPublicUrl(fileName);
      setImageFileUrl(urlData.publicUrl); // image preview
    }
    setImageFileUploading(false);
  }
  console.log(session);
  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="lg:inline-flex">
          <Image src="/instalogo.png" width={96} height={96} alt="logo" />
        </Link>
        <Link href="/" className="sm:hidden">
          <Image src="/instalogotitle.png" width={96} height={96} alt="logo" />
        </Link>
        <input
          type="text"
          placeholder="search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px] "
        />

        {session ? (
          <>
            <div className="flex gap-2 items-center">
              <IoMdAddCircleOutline
                className="text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600"
                onClick={() => setIsOpen(true)}
              />
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={signOut}
              />
            </div>
          </>
        ) : (
          <button
            onClick={() => signIn}
            className="text-sm font-semibold text-blue-500"
          >
            Log In
          </button>
        )}
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          ariaHideApp={false}
          className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
          onRequestClose={() => setIsOpen(false)}
        >
          <div className="flex flex-col justify-center items-center h-[100%]">
            {selectedFile ? (
              <img
                onClick={() => setSelectedFile(null)}
                src={imageFileUrl}
                alt="selected file"
                className={`w-full max-h-[250px] object-over cursor-pointer ${
                  imageFileUploading ? "animate-pulse" : ""
                }`}
              />
            ) : (
              <>
                <HiCamera
                  onClick={() => filePickerRef.current.click()}
                  className="text-4xl text-gray-400 cursor-pointer"
                />
                <input
                  hidden
                  ref={filePickerRef}
                  type="file"
                  accept="image/*"
                  onChange={addImageToPost}
                />
              </>
            )}
            {/* <button onClick={() => setIsOpen(false)}>Close</button> */}
          </div>
          <input
            type="text"
            maxLength="150"
            placeholder="Please enter you caption..."
            className="m-4 border text-center w-full focus:ring-0 outline-none"
          />
          <button className="w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100">
            Upload Post
          </button>
          <AiOutlineClose
            className="cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300"
            onClick={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
