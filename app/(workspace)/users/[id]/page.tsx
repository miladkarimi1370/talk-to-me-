"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, MessageCircle, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

type UserProfile = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  last_seen: string | null;
  bio: string | null;
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const startChat = async () => {
    if (!id) return;
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ other_user_id: id }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/${data.conversation_id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary">
        <p>User not found</p>
        <Link
          href="/users"
          className="mt-4 text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>
    );
  }

  const isMe = user.id === session?.user?.id;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-10">
      <Link
        href="/chat/users"
        className="text-text-secondary hover:text-text-primary flex items-center gap-1 mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="max-w-md mx-auto w-full text-center">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-surface-elevated shadow-lg"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
            {user.full_name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        <h1 className="text-2xl font-bold text-text-primary mt-4">
          {user.full_name}
        </h1>
        <p className="text-text-secondary">@{user.username}</p>

        {user.bio && (
          <p className="text-sm text-text-secondary mt-4 bg-surface-elevated p-4 rounded-xl">
            {user.bio}
          </p>
        )}

        {!isMe && (
          <button
            onClick={startChat}
            className="mt-6 w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Start Conversation
          </button>
        )}
      </div>
    </div>
  );
}