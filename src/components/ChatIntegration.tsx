import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutWorkspace,
} from "../lib/workspaceAuth";
import { MessageSquare, Loader2, Send, Plus, Users, Hash } from "lucide-react";

export default function ChatIntegration() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [newSpaceName, setNewSpaceName] = useState("");
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

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
        alert("메시지가 성공적으로 전송되었습니다.");
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Google Chat</h3>
            <p className="text-xs text-slate-400 mt-1">
              관리자 및 회원 단체 메시지 전송 시스템
            </p>
          </div>
        </div>

        {!needsAuth && (
          <button
            onClick={() => {
              logoutWorkspace();
              setNeedsAuth(true);
              setToken(null);
            }}
            className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800"
          >
            Google 계정 로그아웃
          </button>
        )}
      </div>

      {needsAuth ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-950/50 rounded-2xl border border-slate-800/50">
          <MessageSquare className="w-12 h-12 text-slate-700 mb-4" />
          <h4 className="text-lg font-bold text-slate-300 mb-2">
            구글 챗 연동이 필요합니다
          </h4>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            메시지 전송 및 그룹 관리를 위해 Google 계정으로 로그인해주세요.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              채팅 스페이스 목록
            </h4>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 h-64 overflow-y-auto">
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
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                        selectedSpace === space.name
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-400 hover:bg-slate-900 hover:text-slate-300"
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
                  새로운 스페이스를 생성해주세요.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="새 스페이스 이름"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={createSpace}
                disabled={!newSpaceName.trim() || isCreatingSpace}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
              >
                {isCreatingSpace ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">메시지 보내기</h4>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col h-full min-h-[300px]">
              {selectedSpace ? (
                <>
                  <div className="flex-1 mb-4 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50 p-6 text-center">
                    <div>
                      <div className="text-blue-400 font-bold mb-1">
                        {
                          spaces.find((s) => s.name === selectedSpace)
                            ?.displayName
                        }
                      </div>
                      <div className="text-xs text-slate-500">
                        이 스페이스의 멤버들에게 알림과 함께 메시지가
                        전송됩니다. 일반 회원들에게 문자 보내듯이 활용할 수
                        있습니다.
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="전송할 메시지 내용을 입력하세요..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white resize-none h-24 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      메시지 전송
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">
                    메시지를 전송할 스페이스를 왼쪽에서 선택해주세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
