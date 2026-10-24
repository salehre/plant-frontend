import { h, type FunctionalComponent, type VNode } from 'vue'
import './sidebar-icons.css'

/**
 * آیکن‌های سایدبار (SVG دست‌نویس، ۲۴×۲۴ و خطی؛ رنگ از currentColor می‌گیره).
 *
 * هر آیکن از چند «پارت» ساخته شده که کلاس `si-part si-part--<name>` دارن
 * (مثلاً `si-part--roof` یا `si-part--teeth`). بعداً برای انیمیشن کلیک، فقط
 * با CSS همین پارت‌ها رو هدف می‌گیریم و لازم نیست SVG ها رو دست بزنیم.
 * انیمیشن‌ها توی sidebar-icons.css ـن و وقتی لینک کلاس `sidebar-link--active` داشته باشه اجرا می‌شن.
 * اندازه رو از بیرون با کلاس بده: <component :is="sidebarIcons.home" class="size-5" />
 */

type Part = (index: number) => VNode

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
  focusable: 'false',
} as const

const cls = (part: string) => `si-part si-part--${part}`

const path = (part: string, d: string): Part => () => h('path', { class: cls(part), d })
const circle = (part: string, cx: number, cy: number, r: number): Part => () => h('circle', { class: cls(part), cx, cy, r })
const rect = (part: string, x: number, y: number, width: number, height: number, rx = 0): Part =>
  () => h('rect', { class: cls(part), x, y, width, height, rx })

function createIcon(name: string, parts: Part[]): FunctionalComponent {
  const Icon: FunctionalComponent = () =>
    h('svg', { ...base, class: `si si--${name}` }, parts.map((part, index) => part(index)))
  Icon.displayName = `SidebarIcon_${name}`
  return Icon
}

export const sidebarIcons = {
  // لوگو
  leaf: createIcon('leaf', [
    path('blade', 'M20 4C10 4 5 8.5 5 14.5c0 2 .8 3.7 2 4.8C8.4 20.4 10 21 12 21c5.5 0 8-5.5 8-17z'),
    path('vein', 'M5 21c2-5 5-8.5 9-11'),
  ]),

  // خانه
  home: createIcon('home', [
    path('roof', 'M3 11.5 12 4l9 7.5'),
    path('body', 'M5.5 10v9.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V10'),
    path('door', 'M10 20.5V15h4v5.5'),
  ]),

  // گیاهان من
  sprout: createIcon('sprout', [
    path('soil', 'M8 21h8'),
    path('stem', 'M12 21v-9'),
    path('leaf-left', 'M12 13c0-3.4-2.5-5.5-7-5.5 0 3.5 2 5.5 7 5.5z'),
    path('leaf-right', 'M12 11c0-3.5 2.5-6 7-6 0 3.5-2 6-7 6z'),
  ]),

  // کاتالوگ
  compass: createIcon('compass', [
    circle('ring', 12, 12, 9),
    path('needle', 'M15.5 8.5l-2 5-5 2 2-5z'),
  ]),

  // تشخیص گیاه
  scanLine: createIcon('scan-line', [
    path('corner-tl', 'M4 8V6a2 2 0 0 1 2-2h2'),
    path('corner-tr', 'M16 4h2a2 2 0 0 1 2 2v2'),
    path('corner-br', 'M20 16v2a2 2 0 0 1-2 2h-2'),
    path('corner-bl', 'M8 20H6a2 2 0 0 1-2-2v-2'),
    path('line', 'M7 12h10'),
  ]),

  // دکتر گیاه
  stethoscope: createIcon('stethoscope', [
    path('ears', 'M11 2v2M5 2v2'),
    path('tube', 'M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1'),
    path('cord', 'M8 15a6 6 0 0 0 12 0v-3'),
    circle('chest', 20, 10, 2),
  ]),

  // تقویم مراقبت
  calendarCheck: createIcon('calendar-check', [
    rect('body', 4, 5, 16, 15, 2),
    path('rings', 'M8 3v4M16 3v4'),
    path('header', 'M4 10h16'),
    path('check', 'm9 15 2 2 4-4'),
  ]),

  // پروفایل
  user: createIcon('user', [
    circle('head', 12, 8, 4),
    path('body', 'M4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5'),
  ]),

  // درباره
  info: createIcon('info', [
    circle('ring', 12, 12, 9),
    path('stem', 'M12 11v5'),
    path('dot', 'M12 8h.01'),
  ]),

  // تنظیمات
  settings: createIcon('settings', [
    circle('ring', 12, 12, 7),
    circle('core', 12, 12, 2.8),
    path('teeth', 'M19.2 12h2.4M12 19.2v2.4M4.8 12H2.4M12 4.8V2.4M17.1 17.1l1.7 1.7M6.9 17.1l-1.7 1.7M6.9 6.9 5.2 5.2M17.1 6.9l1.7-1.7'),
  ]),

  // ظاهر و زبان (زیرمنوی تنظیمات)
  palette: createIcon('palette', [
    path('body', 'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z'),
    path('dot-1', 'M13.5 6.5h.01'),
    path('dot-2', 'M17.5 10.5h.01'),
    path('dot-3', 'M6.5 12.5h.01'),
    path('dot-4', 'M8.5 7.5h.01'),
  ]),

  // آدرس‌ها (زیرمنوی تنظیمات)
  mapPin: createIcon('map-pin', [
    path('pin', 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'),
    circle('dot', 12, 10, 3),
  ]),

  // داشبورد
  layoutDashboard: createIcon('layout-dashboard', [
    rect('tile-1', 3, 3, 7, 9, 1.5),
    rect('tile-2', 14, 3, 7, 5, 1.5),
    rect('tile-3', 14, 12, 7, 9, 1.5),
    rect('tile-4', 3, 16, 7, 5, 1.5),
  ]),

  // آب‌وهوا
  cloudSun: createIcon('cloud-sun', [
    circle('sun', 8, 8, 3),
    path('rays', 'M8 2v1.2M2 8h1.2M3.8 3.8l.9.9M12.2 3.8l-.9.9'),
    path('cloud', 'M7.5 20h10a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 7.3 14 3 3 0 0 0 7.5 20z'),
  ]),

  // انجمن
  users: createIcon('users', [
    circle('front-head', 9, 8, 3.5),
    path('front-body', 'M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6'),
    path('back-head', 'M16 4.7a3.5 3.5 0 0 1 0 6.6'),
    path('back-body', 'M18 14.3c2.2.6 3.5 2.4 3.5 5.7'),
  ]),

  // پشتیبانی
  lifeBuoy: createIcon('life-buoy', [
    circle('ring', 12, 12, 9),
    circle('hole', 12, 12, 3.5),
    path('straps', 'M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M14.5 9.5l3.9-3.9M5.6 18.4l3.9-3.9'),
  ]),

  // تماس با ما
  mail: createIcon('mail', [
    rect('envelope', 3, 5, 18, 14, 2),
    path('flap', 'M3.5 7l8.5 6 8.5-6'),
  ]),
  
} as const

export type SidebarIconName = keyof typeof sidebarIcons