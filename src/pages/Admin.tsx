import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowLeft,
  Users,
  Edit2,
  X,
  ShieldAlert,
  BadgeCheck,
  CreditCard,
  Check,
  Ban,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.tsx";
import { getSettings, saveSettings } from "../lib/settings.ts";
import MeetIntegration from "../components/MeetIntegration";
import ChatIntegration from "../components/ChatIntegration";

export default function Admin() {
  const { user, profile, loading, getToken } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "hero" | "benefits" | "users" | "applications" | "designs" | "meetings"
  >("hero");

  // User list states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Card Application states
  const [applicationsList, setApplicationsList] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Card Design states
  const [designsList, setDesignsList] = useState<any[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [editingDesign, setEditingDesign] = useState<any | null>(null);
  const [designForm, setDesignForm] = useState({
    id: "",
    name: "",
    imageUrl: "",
    textColor: "#ffffff",
    accentColor: "Gold",
  });
  const [savingDesign, setSavingDesign] = useState(false);

  // Edit User modal states
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editTier, setEditTier] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editReferred, setEditReferred] = useState("");
  const [savingUser, setSavingUser] = useState(false);

  const isAdmin = profile?.role === "Admin";

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      getSettings().then(setSettings);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsersList(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplicationsList(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleUpdateAppStatus = async (
    appId: string,
    newStatus: "approved" | "rejected",
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      alert(`신청 상태가 성공적으로 변경되었습니다.`);
      fetchApplications();
    } catch (err) {
      console.error("Error changing status:", err);
      alert(
        "상태 업데이트 실패: " +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  const fetchDesigns = async () => {
    setLoadingDesigns(true);
    try {
      const response = await fetch("/api/designs");
      if (!response.ok) throw new Error("Failed to fetch designs");
      const data = await response.json();
      setDesignsList(data || []);
    } catch (err) {
      console.error("Error fetching card designs:", err);
    } finally {
      setLoadingDesigns(false);
    }
  };

  const handleSaveDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !designForm.id.trim() ||
      !designForm.name.trim() ||
      !designForm.imageUrl.trim()
    ) {
      alert("디자인 ID, 템플릿 이름, 고해상 이미지 URL은 필수 항목입니다.");
      return;
    }

    setSavingDesign(true);
    try {
      const token = await getToken();
      const payload = {
        id: designForm.id.trim().toLowerCase(),
        name: designForm.name.trim(),
        image_url: designForm.imageUrl.trim(),
        text_color: designForm.textColor || "#ffffff",
        accent_color: designForm.accentColor || "Gold",
      };
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save design");
      alert("세련된 카드 디자인이 성공적으로 보존되었습니다!");
      setDesignForm({
        id: "",
        name: "",
        imageUrl: "",
        textColor: "#ffffff",
        accentColor: "Gold",
      });
      setEditingDesign(null);
      fetchDesigns();
    } catch (err) {
      console.error("Error saving card design:", err);
      alert("카드 디자인 저장에 실패했습니다.");
    } finally {
      setSavingDesign(false);
    }
  };

  const handleDeleteDesign = async (id: string) => {
    if (!confirm("정말로 이 카드 디자인 템플릿을 제거하시겠습니까?")) return;
    try {
      const token = await getToken();
      const response = await fetch(`/api/designs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete design");
      alert("디자인 템플릿이 삭제되었습니다.");
      fetchDesigns();
    } catch (err) {
      console.error("Error deleting card design:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "users") {
        fetchUsers();
      } else if (activeTab === "applications") {
        fetchApplications();
        fetchDesigns();
      } else if (activeTab === "designs") {
        fetchDesigns();
      }
    }
  }, [isAdmin, activeTab]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const token = await getToken();
      await saveSettings(settings);
      alert("설정이 저장되었습니다.");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);

    try {
      const token = await getToken();
      const payload = {
        display_name: editName,
        phone_number: editPhone,
        tier: editTier,
        role: editRole,
        referred_by_email: editReferred.trim(),
      };

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update user profile");

      alert("회원 정보 및 하위 추천 정보가 동기화 저장되었습니다.");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user profile:", err);
      alert("회원 프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setSavingUser(false);
    }
  };

  const openEditModal = (targetUser: any) => {
    setEditingUser(targetUser);
    setEditName(targetUser.display_name || "");
    setEditPhone(targetUser.phone_number || "");
    setEditTier(targetUser.tier || "Basic");
    setEditRole(targetUser.role || "User");
    setEditReferred(targetUser.referred_by_email || "");
  };

  const getDesignName = (id: string) => {
    const ds = designsList.find((d) => d.id === id);
    return ds ? ds.name.split(" (")[0] : id;
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-5 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-display font-black tracking-tighter">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            설정 저장하기
          </button>
        </div>

        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-8 py-4 text-sm font-black tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === "hero" ? "text-blue-600" : "text-slate-400"}`}
          >
            Hero Section
            {activeTab === "hero" && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            className={`px-8 py-4 text-sm font-black tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === "benefits" ? "text-blue-600" : "text-slate-400"}`}
          >
            Benefits
            {activeTab === "benefits" && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-8 py-4 text-sm font-black tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === "users" ? "text-blue-600" : "text-slate-400"}`}
          >
            User Profiles (회원관리)
            {activeTab === "users" && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-8 py-4 text-sm font-black tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === "applications" ? "text-blue-600" : "text-slate-400"}`}
          >
            Fan Registrations (나의 팬 등록 관리)
            {activeTab === "applications" && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("designs")}
            className={`px-8 py-4 text-sm font-black tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === "designs" ? "text-blue-600" : "text-slate-400"}`}
          >
            Fandom Photos (팬 사진/디자인 관리)
            {activeTab === "designs" && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-8 py-4 text-sm font-black tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === "meetings" ? "text-blue-600" : "text-slate-400"}`}
          >
            Communications (화상/채팅)
            {activeTab === "meetings" && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
              />
            )}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          {activeTab === "hero" && (
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={settings.hero.badge}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, badge: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={settings.hero.artist}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, artist: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Title
                  </label>
                  <input
                    type="text"
                    value={settings.hero.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.hero.subtitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Tagline
                </label>
                <input
                  type="text"
                  value={settings.hero.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, tagline: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Membership Fee
                </label>
                <input
                  type="text"
                  value={settings.hero.membershipFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, membershipFee: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                />
              </div>
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Manage Benefits</h3>
                <button
                  onClick={() => {
                    const newBenefits = [
                      ...settings.benefits,
                      { ...settings.benefits[0], title: "New Benefit" },
                    ];
                    setSettings({ ...settings, benefits: newBenefits });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-black"
                >
                  <Plus className="w-4 h-4" /> Add Benefit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settings.benefits.map((benefit: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4"
                  >
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black text-blue-600 uppercase">
                        Benefit {idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          const newBenefits = settings.benefits.filter(
                            (_: any, i: number) => i !== idx,
                          );
                          setSettings({ ...settings, benefits: newBenefits });
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={benefit.title}
                      onChange={(e) => {
                        const newBenefits = [...settings.benefits];
                        newBenefits[idx].title = e.target.value;
                        setSettings({ ...settings, benefits: newBenefits });
                      }}
                      placeholder="Benefit Title"
                      className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold"
                    />
                    <textarea
                      value={benefit.description}
                      onChange={(e) => {
                        const newBenefits = [...settings.benefits];
                        newBenefits[idx].description = e.target.value;
                        setSettings({ ...settings, benefits: newBenefits });
                      }}
                      placeholder="Description"
                      className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs h-20"
                    />
                    <input
                      type="text"
                      value={benefit.price}
                      onChange={(e) => {
                        const newBenefits = [...settings.benefits];
                        newBenefits[idx].price = e.target.value;
                        setSettings({ ...settings, benefits: newBenefits });
                      }}
                      placeholder="Price info"
                      className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">
                  회원 프로필 수정 및 영업 등급 관리
                </h3>
              </div>

              {loadingUsers ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-slate-400 text-xs font-semibold">
                    회원 데이터베이스를 동기화 중입니다...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="p-4">이름</th>
                        <th className="p-4">이메일</th>
                        <th className="p-4">등급 (Tier)</th>
                        <th className="p-4">역할 (Role)</th>
                        <th className="p-4">연락처</th>
                        <th className="p-4">추천인 (Recommender)</th>
                        <th className="p-4">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {usersList.map((usr) => (
                        <tr
                          key={usr.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-4 font-bold text-slate-800">
                            {usr.display_name}
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-500">
                            {usr.email}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${
                                usr.tier === "Legend Tier"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : usr.tier === "Gold"
                                    ? "bg-slate-100 text-slate-800"
                                    : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              {usr.tier}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                usr.role === "Admin"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : usr.role === "Sales"
                                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                    : "bg-slate-50 text-slate-500"
                              }`}
                            >
                              {usr.role === "Admin"
                                ? "관리자"
                                : usr.role === "Sales"
                                  ? "크리에이터"
                                  : "일반회원"}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-semibold text-slate-500">
                            {usr.phone_number || "미등록"}
                          </td>
                          <td className="p-4 text-xs font-mono text-slate-500">
                            {usr.referred_by_email || "-"}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => openEditModal(usr)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg hover:scale-105 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">
                  나의 팬 선택 & 멤버십 등록 정보 관리
                </h3>
              </div>

              {loadingApps ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-slate-400 text-xs font-semibold">
                    데이터베이스로부터 발급 신청 건들을 동기화 중입니다...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="p-4">신청자</th>
                        <th className="p-4">영어 이니셜/닉네임</th>
                        <th className="p-4">지정 팬 사진/디자인</th>
                        <th className="p-4">휴대폰 번호</th>
                        <th className="p-4">배송지 주소</th>
                        <th className="p-4">신청일자</th>
                        <th className="p-4">상태</th>
                        <th className="p-4 text-center">승인 변경</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {applicationsList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-8 text-center text-xs text-slate-400 font-bold"
                          >
                            현재 접수된 나의 팬 선택 등록 내역이 존재하지
                            않습니다.
                          </td>
                        </tr>
                      ) : (
                        applicationsList.map((app) => (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="font-bold text-slate-800">
                                {app.display_name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {app.email}
                              </div>
                            </td>
                            <td className="p-4 font-black text-slate-900 tracking-wide">
                              {app.card_name}
                            </td>
                            <td className="p-4 capitalize font-semibold text-xs text-blue-600">
                              {getDesignName(app.card_color)}
                            </td>
                            <td className="p-4 text-xs font-semibold text-slate-600">
                              {app.phone_number}
                            </td>
                            <td
                              className="p-4 max-w-xs truncate text-xs text-slate-500 font-medium"
                              title={`${app.address} ${app.detail_address}`}
                            >
                              {app.address} {app.detail_address}
                            </td>
                            <td className="p-4 text-xs text-slate-400">
                              {app.created_at
                                ? new Date(app.created_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${
                                  app.status === "approved"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : app.status === "rejected"
                                      ? "bg-red-50 text-red-700 border border-red-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {app.status === "approved"
                                  ? "승인 및 각인"
                                  : app.status === "rejected"
                                    ? "보완 필요"
                                    : "대기중"}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateAppStatus(app.id, "approved")
                                  }
                                  disabled={app.status === "approved"}
                                  className="p-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-600 rounded-lg hover:scale-105 transition-all"
                                  title="발급 승인"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateAppStatus(app.id, "rejected")
                                  }
                                  disabled={app.status === "rejected"}
                                  className="p-2 bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-600 rounded-lg hover:scale-105 transition-all"
                                  title="발급 보완(반려)"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "designs" && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      스타 사진 및 멤버십 템플릿 제어
                    </h3>
                    <p className="text-xs text-slate-400">
                      사용자들이 팬 선택 단계에서 마주하게 되는 스타 고해상도
                      백그라운드 이미지를 추가, 수정, 삭제합니다.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingDesign(true);
                    setDesignForm({
                      id: `design_${Date.now().toString().slice(-4)}`,
                      name: "",
                      imageUrl: "",
                      textColor: "#ffffff",
                      accentColor: "Gold",
                    });
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-black self-start transition-all"
                >
                  <Plus className="w-4 h-4" /> 새로운 스타 템플릿 추가
                </button>
              </div>

              {editingDesign && (
                <form
                  onSubmit={handleSaveDesign}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      스타 사진/디자인 편집 및 등록
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingDesign(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors bg-white px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      숨기기
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">
                        디자인 고유 식별 ID (영문, -, _)
                      </label>
                      <input
                        type="text"
                        required
                        disabled={
                          designsList.some((d) => d.id === designForm.id) &&
                          !editingDesign.id
                        }
                        value={designForm.id}
                        onChange={(e) =>
                          setDesignForm({
                            ...designForm,
                            id: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9_\-]/g, ""),
                          })
                        }
                        placeholder="예: platinum_gold"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 disabled:bg-slate-100 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">
                        스타 템플릿 노출 이름 (국문/영문)
                      </label>
                      <input
                        type="text"
                        required
                        value={designForm.name}
                        onChange={(e) =>
                          setDesignForm({ ...designForm, name: e.target.value })
                        }
                        placeholder="예: 코요태 신지 오피셜 고해상도"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">
                        폰트/텍스트 색상 (#코드 또는 클래스)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            designForm.textColor.startsWith("#")
                              ? designForm.textColor
                              : "#ffffff"
                          }
                          onChange={(e) =>
                            setDesignForm({
                              ...designForm,
                              textColor: e.target.value,
                            })
                          }
                          className="w-11 h-11 border border-slate-200 rounded-xl cursor-pointer p-1 shrink-0 bg-white"
                        />
                        <input
                          type="text"
                          value={designForm.textColor}
                          onChange={(e) =>
                            setDesignForm({
                              ...designForm,
                              textColor: e.target.value,
                            })
                          }
                          placeholder="#ffffff"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">
                        고해상 스타/팬 사진 배경 이미지 URL (HTTPS 경로)
                      </label>
                      <input
                        type="text"
                        required
                        value={designForm.imageUrl}
                        onChange={(e) =>
                          setDesignForm({
                            ...designForm,
                            imageUrl: e.target.value,
                          })
                        }
                        placeholder="예: https://images.unsplash.com/photo-..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">
                        포인트 인쇄 각인 선종
                      </label>
                      <select
                        value={designForm.accentColor}
                        onChange={(e) =>
                          setDesignForm({
                            ...designForm,
                            accentColor: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 font-sans"
                      >
                        <option value="Gold">Gold Theme (금도금 각인)</option>
                        <option value="Silver">
                          Silver Theme (플래티넘 은도금 각인)
                        </option>
                        <option value="Rose Gold">
                          Rose Gold Theme (황동 로즈 무늬)
                        </option>
                        <option value="Black">
                          Black Layer (카본 메탈 코팅)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingDesign(null)}
                      className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-50 transition-all"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={savingDesign}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      {savingDesign ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      디자인 템플릿 저장
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {designsList.map((design) => (
                  <div
                    key={design.id}
                    className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[1.58/1] relative overflow-hidden">
                      <img
                        src={design.image_url}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-slate-800">
                            {design.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {design.id}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingDesign(design);
                              setDesignForm({
                                id: design.id,
                                name: design.name,
                                imageUrl: design.image_url,
                                textColor: design.text_color,
                                accentColor: design.accent_color,
                              });
                            }}
                            className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDesign(design.id)}
                            className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      Communications
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      Manage virtual meetings and chat sessions
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-2xl bg-slate-900 rounded-3xl overflow-hidden p-6 text-white">
                <MeetIntegration />
              </div>
              
              <div className="mt-8">
                <ChatIntegration />
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <Edit2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      회원 등급 및 프로필 수정
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">
                      {editingUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Membership Tier
                    </label>
                    <select
                      value={editTier}
                      onChange={(e) => setEditTier(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="Basic">Basic (일반회원)</option>
                      <option value="Gold">Gold (정회원/크리에이터)</option>
                      <option value="Legend Tier">Legend Tier (VVIP)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      System Role
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="User">User (팬)</option>
                      <option value="Sales">Sales (크리에이터)</option>
                      <option value="Admin">Admin (관리자)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-600">
                    Recommender Email (추천인 수정)
                  </label>
                  <input
                    type="email"
                    value={editReferred}
                    onChange={(e) => setEditReferred(e.target.value)}
                    placeholder="추천인이 없을 경우 비워두세요"
                    className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-3.5 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold px-1">
                    추천인 수정 시 계보(Ancestors)가 자동 재계산됩니다.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all text-sm"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={savingUser}
                    className="flex-2 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                  >
                    {savingUser ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    변경사항 저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
