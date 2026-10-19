import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  Check,
  CircleCheck,
  CirclePlay,
  Eye,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Columns2,
  Droplet,
  FileHeart,
  Focus,
  GraduationCap,
  Grid3x3,
  HeartHandshake,
  HeartPulse,
  Hospital,
  ImageOff,
  Info,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  MessagesSquare,
  MoveHorizontal,
  Phone,
  Play,
  Quote,
  Route,
  Salad,
  Scale,
  ScanLine,
  ShieldCheck,
  ShieldPlus,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Every icon the content files may reference, by a stable name. Icons render
 * as inline SVG at build time (no icon font, no client JavaScript).
 */
const icons = {
  activity: Activity,
  arrow: ArrowRight,
  arrowUpRight: ArrowUpRight,
  award: Award,
  badge: BadgeCheck,
  book: BookOpen,
  briefcase: Briefcase,
  calendar: CalendarCheck,
  calendarDays: CalendarDays,
  check: Check,
  checkCircle: CircleCheck,
  playCircle: CirclePlay,
  eye: Eye,
  plus: Plus,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  help: CircleHelp,
  clipboard: ClipboardCheck,
  clipboardList: ClipboardList,
  clock: Clock,
  columns: Columns2,
  droplet: Droplet,
  fileHeart: FileHeart,
  focus: Focus,
  graduation: GraduationCap,
  mesh: Grid3x3,
  handshake: HeartHandshake,
  heart: HeartPulse,
  hospital: Hospital,
  imageOff: ImageOff,
  info: Info,
  idea: Lightbulb,
  lock: Lock,
  mail: Mail,
  mapPin: MapPin,
  expand: Maximize2,
  menu: Menu,
  message: MessageCircle,
  messages: MessagesSquare,
  moveX: MoveHorizontal,
  phone: Phone,
  play: Play,
  quote: Quote,
  route: Route,
  salad: Salad,
  scale: Scale,
  scan: ScanLine,
  shield: ShieldCheck,
  shieldPlus: ShieldPlus,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  user: UserRound,
  video: Video,
  close: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Mirror in right-to-left pages (for arrows and other directional icons). */
  directional?: boolean;
};

export function Icon({ name, size = 20, strokeWidth = 1.75, className, directional }: IconProps) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      className={[directional ? "icon-directional" : null, className].filter(Boolean).join(" ") || undefined}
    />
  );
}
