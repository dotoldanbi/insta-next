"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Modal from "react-modal";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { app } from "@/app/firebase";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [postUploading, setPostUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const filePickerRef = useRef(null);
  const db = getFirestore(app);
  function addImageToPost(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  async function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName); // new file name with timestamp
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
        setImageFileUploading(false); // 업로딩 상태
        setImageFileUrl(null); // 이미지 로컬 URLㄹ
        setSelectedFile(null); // 선택된 파일 초기화
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // firebase에 업로드된 이미지 URL
          setImageFileUploading(false); // 업로딩 상태
        });
      }
    );
  }

  async function handleSubmit() {
    setPostUploading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: caption,
      profileImg: session.user.image,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });
    setPostUploading(false);
    setIsOpen(false);
  }

  return (
    <div className="shadow-sm border-b">
      <div className="flex justify-between items-center max-w-6xl mx-auto sticky top-0 bg-white z-30 p-3">
        {}
        <Link href="/">
          <Image
            className="hidden lg:inline-flex"
            src="/instagram-logo-letter.png"
            width={96}
            height={96}
            alt="instagram logo"
          />
        </Link>
        <Link href="/">
          <Image
            className="lg:hidden"
            src="/instalogo.png"
            width={40}
            height={40}
            alt="instagram logo"
          />
        </Link>
        {}
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-width-1 border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px] "
        />

        {session ? (
          <div className="flex items-center space-x-4">
            <IoMdAddCircleOutline
              onClick={() => setIsOpen(true)}
              className="text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600"
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={signOut}
            />
          </div>
        ) : (
          <div></div>
        )}

        <button
          onClick={signIn}
          className="text-sm font-semibold text-blue-500"
        >
          Log In
        </button>
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
          onRequestClose={() => setIsOpen(false)}
          ariaHideApp={false}
        >
          {/* onRequestClose={() => setIsOpen(false) : outside click */}
          <div className="fkex flex-col justify-center items-center h-[100%]">
            {selectedFile ? (
              <img
                onClick={() => filePickerRef.current.click()}
                src={imageFileUrl}
                alt=""
                className={`w-full max-h-[250px] object-over cursor-pointer ${
                  imageFileUploading ? "animate-pulse" : ""
                }`}
              />
            ) : (
              <HiCamera
                onClick={() => filePickerRef.current.click()}
                className="text-5xl text-gray-500 cursor-pointer"
              />
            )}

            <input
              hidden
              ref={filePickerRef}
              type="file"
              accept="image/*"
              onChange={addImageToPost}
            />
          </div>
          <input
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            maxLength="150"
            placeholder="Please enter your caption"
            className="m-4 border-none text-center w-full focus:ring-0 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={
              !selectedFile ||
              caption.trim() === "" ||
              postUploading ||
              imageFileUploading
            }
            className="w-full bg-red-600 text-white shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:hover:brightness-100"
          >
            Upload Post
          </button>
          <AiOutlineClose
            className="cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-200"
            onClick={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
