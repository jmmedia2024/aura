import { Star, Music, Ship, Sparkles, Coins, CreditCard } from 'lucide-react';
import { supabase } from './supabase'; // Keep if used elsewhere or remove if not needed, but we don't need it here.

export const ICON_MAP: Record<string, any> = {
  Star,
  Music,
  Ship,
  Sparkles,
  Coins,
  CreditCard,
};

export const DEFAULT_SETTINGS = {
  hero: {
    badge: "R.ef 30th Anniversary Project",
    artist: "대한민국 1세대 댄스 레전드 R.ef (알이에프)",
    title: "30주년 한정판",
    subtitle: "VIP 멤버십 카드",
    tagline: "박철우, 성대현, 이성욱과 함께하는 30년의 추억, 영원한 혜택",
    membershipFee: "₩1,100,000",
  },
  benefits: [
    {
      title: "R.ef 30주년 잠실 실내체육관 콘서트 VIP",
      description: "90년대 감성을 깨우는 R.ef 완전체 30주년 기념 단독 콘서트 최전방 VIP석",
      price: "일반 판매가 250,000원 상당",
      icon: "Music",
      color: "from-amber-400 to-amber-600",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80",
      date: "2026-10-15T19:00:00",
      schedule: ["17:30 - VIP 전용 라운지 입장", "18:30 - 아티스트 리허설 관람 (Sound Check)", "19:30 - 본 공연 (상심, 고요속의 외침 등 히트곡 메들리)", "21:30 - 팬들과의 단체 사진 촬영"]
    },
    {
      title: "럭셔리 팬 크루즈 '고요속의 여행'",
      description: "R.ef 멤버들과 함께하는 2박 3일 초호화 크루즈 투어 및 선상 팬미팅",
      price: "일반 판매가 880,000원 상당",
      icon: "Ship",
      color: "from-slate-700 to-slate-900",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80",
      date: "2026-11-20T11:00:00",
      schedule: ["Day 1 - 인천항 출발 및 웰컴 갈라 디너", "Day 2 - R.ef 멤버와 함께하는 토크 콘서트", "Day 3 - 기항지 관광 및 개별 포토타임 후 하선"]
    },
    {
      title: "그랜드 하얏트 프리미엄 디너쇼",
      description: "최고급 코스 요리와 함께 즐기는 R.ef의 고품격 라이브 무대",
      price: "회원 전용 한정 초대",
      icon: "Star",
      color: "from-[#D4AF37] to-[#B8860B]",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
      date: "2026-12-24T18:30:00",
      schedule: ["18:00 - 레드카펫 포토존", "19:00 - 특급 셰프 시그니처 7코스 디너", "20:30 - R.ef 크리스마스 이브 스페셜 라이브", "21:40 - 멤버들이 직접 전달하는 크리스마스 선물"]
    },
    {
      title: "30주년 한정판 24K 순금 카드",
      description: "R.ef 30주년을 기념하여 제작된 소장가치 100%의 실물 골드 카드",
      price: "가입 시 증정 (비매품)",
      icon: "Coins",
      color: "from-yellow-400 to-amber-500",
      image: "https://images.unsplash.com/photo-1624365169192-37d37a85e921?auto=format&fit=crop&q=80",
      date: "2026-09-01T00:00:00",
      schedule: ["D+1 - 디자인 개인화 각인", "D+7 - 특수 보안 배송팀 출동", "D+14 - 전담 매니저 해피콜 및 수령 확인"]
    },
    {
      title: "VIP 전담 비서 서비스 (24/7)",
      description: "R.ef 활동 관련 모든 정보와 공연 예약을 우선 처리해드리는 전용 핫라인",
      price: "연중 상시 제공",
      icon: "Sparkles",
      color: "from-slate-800 to-black",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      date: "2026-06-01T00:00:00",
      schedule: ["- 공연 및 행사 최우선 예약 시스템", "- 굿즈 신상품 선구매 권한", "- 전용 CS 채널 1:1 상담사 배치"]
    }
  ]
};

export async function getSettings() {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) {
      throw new Error('Failed to fetch settings from API');
    }
    const data = await response.json();
    if (data && data.landing) {
      return data.landing;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: any) {
  const { supabase } = await import('./supabase');
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await fetch('/api/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ key: 'landing', value: settings })
  });
  
  if (!response.ok) {
    throw new Error('Failed to save settings');
  }
}
