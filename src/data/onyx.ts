/**
 * Public Onyx facts for the product showcase and /products/onyx.
 *
 * Source: the product's own site, https://onyx.cyryxlabs.com/ (read
 * 2026-11-13, version 1.14.25). Only what that page states is repeated here.
 * Media in /public/media/onyx are the product's own captures, shown there with
 * example data.
 */
export const ONYX_SITE = "https://onyx.cyryxlabs.com/";
export const ONYX_REVIEWED = "2026-11-13";
export const ONYX_VERSION = "1.14.25";

export const ONYX_HEADLINE = "Hire the employee who never logs off.";
export const ONYX_SUMMARY =
  "Onyx is an AI coworker that lives on your Windows PC. It talks with you in real time, works your inbox, does the research, operates your apps and remembers everything, in a vault you own. Outside your machine, it acts on your word.";
export const ONYX_AVAILABILITY =
  "Free while in beta. For Windows 10 and 11, 64-bit. Runs on free AI model tiers with your own keys.";

export const ONYX_STATS = [
  { value: "6", label: "Languages it speaks" },
  { value: "8", label: "Characters to choose from" },
  { value: "24/7", label: "On your own PC" },
] as const;

export const ONYX_CHAT = {
  ask: "What needs me today?",
  answer:
    "Two things. Dana's redline is drafted for your review, and the investor call is at 09:30.",
} as const;

export const ONYX_SKILLS = [
  "Inbox triage",
  "Research with sources",
  "Morning brief",
  "Calendar",
  "Meetings and summaries",
  "Second Brain",
  "Operates your apps",
  "Site watches",
  "Live voice",
  "Android and Telegram",
  "Approvals",
  "Receipts for every action",
] as const;

export const ONYX_HOW = [
  {
    title: "It talks",
    body: "Live voice in your language. Interrupt it mid-sentence and it stops, listens and picks up from there.",
    image: "/media/onyx/hud-android-a_speaking.webp",
    width: 1440,
    height: 900,
    alt: "Onyx speaking in its own window while a comparison opens beside it, with example data",
  },
  {
    title: "It remembers",
    body: "A Second Brain in an Obsidian vault on your PC. It reads before it answers and files what it learns.",
    image: "/media/onyx/win-document.webp",
    width: 760,
    height: 560,
    alt: "An Onyx document window, with example data",
  },
  {
    title: "It does the work",
    body: "Inbox, calendar, research, files and your apps. It checks the screen for proof before it says done.",
    image: "/media/onyx/win-timeline.webp",
    width: 760,
    height: 560,
    alt: "An Onyx timeline window, with example data",
  },
  {
    title: "It shows its work",
    body: "Comparisons, diagrams, plans and exercises open as native windows while it explains them.",
    image: "/media/onyx/win-comparison.webp",
    width: 900,
    height: 470,
    alt: "An Onyx comparison window ranking three vendors, with example data",
  },
] as const;

export const ONYX_DAY = [
  {
    time: "01:00",
    title: "Studies",
    body: "About a dozen topics you care about, each filed into your vault, tagged and linked.",
  },
  {
    time: "07:00",
    title: "Briefs you",
    body: "Agenda, overdue tasks, headlines and what it learned overnight, before your first coffee.",
  },
  {
    time: "08:30",
    title: "Works the inbox",
    body: "Reads every mailbox you connected, sums up what matters and drafts the replies for you to review.",
  },
  {
    time: "11:00",
    title: "Researches and decides with you",
    body: "You ask which vendor is worth it. It comes back with sources, a comparison and a recommendation.",
  },
  {
    time: "15:20",
    title: "Watches",
    body: "A competitor changes their pricing page. The watch catches it and tells you on screen, on the phone or on Telegram.",
  },
  {
    time: "19:45",
    title: "Plans tomorrow",
    body: "You leave the desk. The conversation follows you to the phone, and the week's plan is already on the calendar.",
  },
  {
    time: "23:30",
    title: "Remembers",
    body: "The day becomes a journal: decisions, people, tasks, and the list of what to study tonight.",
  },
] as const;

export const ONYX_SCREENS = [
  {
    id: "hq",
    label: "HQ",
    caption:
      "HQ. What needs you, what is running, today's events and what Onyx has spent, around a live core.",
    video: "/media/onyx/cc-hq.mp4",
    image: "/media/onyx/cc-hq.webp",
    alt: "The Onyx Command Center, HQ screen, with example data",
  },
  {
    id: "brain",
    label: "Second Brain",
    caption: "Second Brain. A neural map of the vault Onyx reads from and files into.",
    video: "/media/onyx/cc-brain.mp4",
    image: "/media/onyx/cc-brain.webp",
    alt: "The Onyx Command Center, Second Brain screen, with example data",
  },
  {
    id: "calendar",
    label: "Calendar",
    caption: "Calendar. Your week, with what Onyx booked and planned.",
    video: null,
    image: "/media/onyx/cc-calendar.webp",
    alt: "The Onyx Command Center, Calendar screen, with example data",
  },
  {
    id: "mail",
    label: "Email",
    caption: "Email. Every mailbox in one place: Onyx drafts, you send.",
    video: null,
    image: "/media/onyx/cc-mail.webp",
    alt: "The Onyx Command Center, Email screen, with example data",
  },
  {
    id: "activity",
    label: "Activity",
    caption: "Activity. What Onyx is doing, what needs your decision, and every action it took.",
    video: null,
    image: "/media/onyx/cc-activity.webp",
    alt: "The Onyx Command Center, Activity screen, with example data",
  },
] as const;

export const ONYX_CONTROL = [
  {
    title: "It asks before it acts outside.",
    body: "Messages, calls, posts and purchases wait for your yes. Want it to just act? Grant a time-boxed authority.",
  },
  {
    title: "Every action leaves a receipt.",
    body: "Each tool call is written to a tamper-evident log on your machine.",
  },
  {
    title: "Spending has a ceiling.",
    body: "Paid generation is priced before it runs and capped per day and per month.",
  },
  {
    title: "Your machine first.",
    body: "Memory, vault and logs live on your PC. Mail credentials are encrypted by Windows.",
  },
  {
    title: "Off-limits stays off-limits.",
    body: "It never opens your password stores or touches system folders.",
  },
  {
    title: "It reads, it doesn't obey strangers.",
    body: "Pages, emails and files are treated as data, never as orders.",
  },
] as const;

export const ONYX_BETA = [
  {
    title: "Everything on",
    body: "Voice, Second Brain, Command Center, inbox, research, apps, characters, phone and Telegram.",
  },
  {
    title: "Updates itself",
    body: "New versions install on their own, downloading only what changed.",
  },
  {
    title: "Your machine",
    body: "Memory, vault and logs stay on your PC. Outside it, Onyx acts on your word.",
  },
  { title: "Free while in beta", body: "No card, no account. Bring your own free AI keys." },
] as const;

export const ONYX_FAQ = [
  {
    q: "What is Onyx?",
    a: "Onyx is an AI coworker made by Cyryx Labs that lives on your Windows PC. It talks with you in real time, works your inbox, does research, operates your apps and remembers what it learns in a vault you own.",
  },
  {
    q: "Is Onyx available now?",
    a: "Yes. Onyx is in a free beta for Windows 10 and 11, 64-bit. You download it from onyx.cyryxlabs.com.",
  },
  {
    q: "Is the beta really free?",
    a: "Yes. During the beta Onyx costs nothing: download it, install it and use everything. Paid plans come later; the beta stays free while it runs.",
  },
  {
    q: "Does Onyx run in the cloud?",
    a: "No. Onyx runs on your Windows PC. Your memory, vault and logs stay there. The thinking runs on the AI models you connect, such as Google Gemini and OpenRouter.",
  },
  {
    q: "Do I pay extra for AI usage?",
    a: "Onyx is built to run on the free tiers of Gemini and OpenRouter with your own keys, and setup walks you through getting them. On free tiers, Google may use content to improve its products; you can connect a paid key instead. Paid media generation only runs within the daily and monthly caps you set.",
  },
  {
    q: "Will it do things without asking me?",
    a: "Not outside your machine. Sending, posting, calling and buying wait for your yes unless you grant a time-boxed authority, and even then it never opens password stores or system folders. Every action is logged.",
  },
  {
    q: "What do I need to run it?",
    a: "A 64-bit PC with Windows 10 or 11. A dedicated graphics card makes the characters look their best; older PCs get a lighter mode automatically.",
  },
  { q: "Does it run on Mac or Linux?", a: "Windows only, for now." },
  {
    q: "Can I use it from my phone?",
    a: "Yes. The Android app pairs with your PC: the PC is the brain, the phone is the remote. You can also chat with Onyx on Telegram.",
  },
  {
    q: "Which languages does it speak?",
    a: "The interface and conversation work in English, Portuguese, Spanish, French, German and Italian, and Onyx answers in the language you speak to it.",
  },
  {
    q: "Is Onyx for teams?",
    a: "Onyx works for one owner on one PC. For AI assistants and agents built for a whole company, see Cyryx Labs AI Agents & Assistants.",
  },
] as const;
