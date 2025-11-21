import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Globe,
  QrCode,
  Shield,
  Smartphone,
  Ticket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const mainFeatures = [
  {
    icon: Calendar,
    title: "Easy Event Management",
    description:
      "Buat dan kelola acara Anda dengan antarmuka yang intuitif. Atur detail acara, jadwal, dan lokasi dengan mudah.",
    color: "from-indigo-500 to-purple-500",
    iconBg: "bg-indigo-500",
  },
  {
    icon: Ticket,
    title: "Flexible Ticketing",
    description:
      "Menawarkan berbagai jenis tiket, diskon, dan promosi untuk menarik lebih banyak peserta.",
    color: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-500",
  },
  {
    icon: QrCode,
    title: "QR Code Check-in",
    description:
      "Sederhanakan proses check-in dengan teknologi QR code yang cepat dan efisien.",
    color: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Dapatkan wawasan mendalam tentang penjualan tiket, kehadiran, dan perilaku peserta melalui dashboard analitik kami.",
    color: "from-cyan-500 to-blue-500",
    iconBg: "bg-cyan-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Proses pembayaran yang aman dan andal dengan berbagai metode pembayaran yang didukung.",
    color: "from-green-500 to-emerald-500",
    iconBg: "bg-green-500",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Kirim pengingat otomatis dan pembaruan acara kepada peserta melalui email dan SMS.",
    color: "from-yellow-500 to-orange-500",
    iconBg: "bg-yellow-500",
  },
];

export const additionalFeatures = [
  { icon: Shield, text: "Enterprise Security" },
  { icon: Zap, text: "Lightning Fast" },
  { icon: Smartphone, text: "Mobile Optimized" },
  { icon: Globe, text: "Multi-language Support" },
  { icon: Clock, text: "24/7 Support" },
  { icon: TrendingUp, text: "Real-time Analytics" },
  { icon: CheckCircle, text: "99.9% Uptime" },
  { icon: Users, text: "Team Collaboration" },
];
