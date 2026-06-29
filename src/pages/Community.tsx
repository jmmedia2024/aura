import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutWorkspace,
} from "../lib/workspaceAuth";
import {
  MessageSquare,
  Loader2,
  Send,
  Plus,
  Users,
  Hash,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const { user: appUser, profile } = useAuth();
  const navigate = useNavigate();
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [newSpaceName, setNewSpaceName] = useState("");
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  useEffect(() => {
    // Only logged in users can see this page
    if (appUser === null) {
      navigate("/login");
    }
  }, [appUser, navigate]);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (user, token) => {
        setToken(token);
        setUser(user);
        setNeedsAuth(false);
      },
      () => setNeedsAuth(true),
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token) {
      fetchSpaces();
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedSpace) {
      fetchMessages(selectedSpace);
      // Setup simple polling every 5 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedSpace, true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token, selectedSpace]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchSpaces = async () => {
    if (!token) return;
    setLoadingSpaces(true);
    try {
      const res = await fetch("https://chat.googleapis.com/v1/spaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.spaces) {
        setSpaces(data.spaces);
      }
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoadingSpaces(false);
    }
  };

  const fetchMessages = async (spaceName: string, silent: boolean = false) => {
    if (!token) return;
    if (!silent) setLoadingMessages(true);
    try {
      const res = await fetch(
        `https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.reverse()); // Show newest at bottom usually, but wait, if it returns oldest first, we might not need to reverse
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const createSpace = async () => {
    if (!token || !newSpaceName.trim()) return;
    setIsCreatingSpace(true);
    try {
      const res = await fetch("https://chat.googleapis.com/v1/spaces", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceType: "SPACE",
          displayName: newSpaceName,
        }),
      });
      const data = await res.json();
      if (data.name) {
        setNewSpaceName("");
        await fetchSpaces();
        setSelectedSpace(data.name);
      }
    } catch (error) {
      console.error("Error creating space:", error);
      alert("Failed to create chat space.");
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const sendMessage = async () => {
    if (!token || !selectedSpace || !newMessage.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(
        `https://chat.googleapis.com/v1/${selectedSpace}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newMessage,
          }),
        },
      );
      if (res.ok) {
        setNewMessage("");
        fetchMessages(selectedSpace);
      } else {
        const error = await res.json();
        throw new Error(error.error?.message || "Failed to send");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert(`메시지 전송 실패: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (appUser === null) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-700">
            R.ef Community
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest">
            VIP 회원들 간의 실시간 대화 공간
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  커뮤니티 채팅방
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  원하는 스페이스에 참여하여 멤버들과 대화를 나누세요
                </p>
              </div>
            </div>

            {!needsAuth && (
              <button
                onClick={() => {
                  logoutWorkspace();
                  setNeedsAuth(true);
                  setToken(null);
                  setSelectedSpace(null);
                }}
                className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800"
              >
                Google 계정 로그아웃
              </button>
            )}
          </div>

          {needsAuth ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-950/50 rounded-2xl border border-slate-800/50">
              <MessageSquare className="w-16 h-16 text-slate-700 mb-6" />
              <h4 className="text-xl font-bold text-slate-300 mb-2">
                채팅에 참여하려면 연동이 필요합니다
              </h4>
              <p className="text-sm text-slate-500 mb-8 max-w-sm">
                Google 계정으로 로그인하여 다른 R.ef VIP 회원들과 대화를
                나눠보세요.
              </p>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
              {/* Sidebar */}
              <div
                className={`md:col-span-1 flex flex-col space-y-4 ${selectedSpace ? "hidden md:flex" : "flex"}`}
              >
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  스페이스 목록
                </h4>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 flex-1 overflow-y-auto custom-scrollbar">
                  {loadingSpaces ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                    </div>
                  ) : spaces.length > 0 ? (
                    <div className="space-y-1">
                      {spaces.map((space) => (
                        <button
                          key={space.name}
                          onClick={() => setSelectedSpace(space.name)}
                          className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                            selectedSpace === space.name
                              ? "bg-amber-600/20 text-amber-500 font-bold border border-amber-500/30"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-300 border border-transparent"
                          }`}
                        >
                          <Hash className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {space.displayName || "Unknown Space"}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm p-4 text-center">
                      스페이스가 없습니다.
                      <br />
                      아래에서 새로 만들어보세요.
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="새 스페이스"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={createSpace}
                    disabled={!newSpaceName.trim() || isCreatingSpace}
                    className="bg-amber-600 hover:bg-amber-700 text-black p-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                  >
                    {isCreatingSpace ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div
                className={`md:col-span-3 h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 ${!selectedSpace ? "hidden md:flex" : "flex"}`}
              >
                {selectedSpace ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
                      <button
                        onClick={() => setSelectedSpace(null)}
                        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <Hash className="w-5 h-5 text-amber-500" />
                      <div>
                        <h4 className="font-bold text-white">
                          {
                            spaces.find((s) => s.name === selectedSpace)
                              ?.displayName
                          }
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Google Chat과 동기화됨
                        </p>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col space-y-6">
                      {loadingMessages && messages.length === 0 ? (
                        <div className="flex-1 flex justify-center items-center">
                          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((msg: any) => {
                          const isMe = msg.sender?.email === user?.email;
                          return (
                            <div
                              key={msg.name}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex gap-3 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                              >
                                <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 overflow-hidden">
                                  {msg.sender?.avatarUrl ? (
                                    <img
                                      src={msg.sender.avatarUrl}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                                      {msg.sender?.displayName?.charAt(0) ||
                                        "?"}
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                >
                                  <div className="text-[10px] text-slate-500 mb-1 px-1">
                                    <span className="font-bold text-slate-300">
                                      {msg.sender?.displayName}
                                    </span>
                                    <span className="ml-2">
                                      {new Date(
                                        msg.createTime,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <div
                                    className={`px-4 py-2.5 text-sm whitespace-pre-wrap shadow-md ${
                                      isMe
                                        ? "bg-amber-600 text-white rounded-2xl rounded-tr-sm"
                                        : "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700"
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-slate-500">
                          <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                          <p className="text-sm">메시지가 없습니다.</p>
                          <p className="text-xs mt-1">
                            첫 메시지를 남겨보세요!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                      <div className="flex gap-2">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="메시지 입력 (Enter로 전송)"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none h-12 custom-scrollbar"
                          rows={1}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isSending}
                          className="w-12 h-12 shrink-0 bg-amber-600 hover:bg-amber-500 text-black flex items-center justify-center rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                          {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                    <p className="text-base font-bold text-slate-400">
                      커뮤니티에 오신 것을 환영합니다
                    </p>
                    <p className="text-sm mt-2">
                      참여할 스페이스를 선택하거나 새로 생성해주세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
