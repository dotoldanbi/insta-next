"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import {
  getFirestore,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { app } from "../firebase";
export default function LikeSection({ id }) {
  const { data: session } = useSession();
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const db = getFirestore(app);
  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    if (likes.findIndex((like) => like.id === session?.user?.uid) !== -1) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [likes]);
  const heartClassName =
    "text-red-500 cursor-pointer text-3xl hover:scale-125 transition-transfrom duration-200 ease-out";

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session?.user?.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session?.user?.uid), {
        username: session?.user?.uid,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {session && (
        <div className="flex border-t border-gray-100 px-4 pt-4">
          {hasLiked ? (
            <HiHeart onClick={likePost} className={heartClassName} />
          ) : (
            <HiOutlineHeart onClick={likePost} className={heartClassName} />
          )}
        </div>
      )}
      {likes.length > 0 && (
        <p>
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
}
