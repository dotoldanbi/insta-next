"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  getFirestore,
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase";
import Moment from "react-moment";
export default function CommentSection({ id }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const db = getFirestore(app);
  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts", id, "comments")),
      (snapshot) => {
        setComments(snapshot.docs);
      },
      orderBy("timestamp", "desc")
    );
  }, [db]);
  async function handleSubmit(e) {
    e.preventDefault();

    const commentToPost = comment;
    setComment("");
    await addDoc(collection(db, "posts", id, "comments"), {
      comment: comment,
      username: session?.user?.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  }

  return (
    <div className="">
      {comments.length > 0 && (
        <div className="mx-10 max-h-24  overflow-y-scroll ">
          {comments.map((comment, id) => (
            <div
              key={id}
              className="flex items-center space-x-2 mb-2 justify-between"
            >
              <img
                src={comment.data().userImage}
                alt="user"
                className="h-7 w-7 rounded-full object-cover"
              />
              <p className="text-sm flex-1 truncate">
                <span className="font-semibold text-gray-sm mr-2">
                  {comment.data().username}
                </span>
                <span>{comment.data().comment}</span>
              </p>
              <Moment fromNow className="text-xs text-gray-400   pr-2">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
      {session && (
        <form onSubmit={handleSubmit}>
          <img
            src={session.user.image}
            alt="useimage"
            className="h-10 w-10 rounded-full border p-[4px] object-cover"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="border-none flex-1 focus:ring-0 outline-none"
          />
          <button
            disabled={!comment.trim()}
            type="submit"
            className="font-semibold text-blue-400 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
