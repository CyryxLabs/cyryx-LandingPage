export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNavigation: NavigationItem[] = [
  {
    label: "Solutions",
    href: "/#solutions",
    description: "Advisory, engineering, automation, and operations",
  },
  { label: "Products", href: "/#products", description: "MAAX Studio and Lyra" },
  { label: "How we work", href: "/#process", description: "The engagement lifecycle" },
  { label: "Research", href: "/#research", description: "Applied systems research" },
  { label: "Company", href: "/company", description: "The Cyryx thesis" },
];

export const solutionNavigation: NavigationItem[] = [
  { label: "AI Strategy & Advisory", href: "/solutions/ai-strategy-advisory" },
  { label: "Digital & Web Systems", href: "/solutions/digital-web-systems" },
  { label: "Workflow Automation", href: "/solutions/workflow-automation" },
  { label: "Internal AI Assistants", href: "/solutions/internal-ai-assistants" },
  { label: "Custom AI Products", href: "/solutions/custom-ai-products" },
  { label: "AI Governance & Cost Control", href: "/solutions/ai-governance-cost-control" },
  { label: "Managed Operations", href: "/solutions/managed-operations" },
];

export const productNavigation: NavigationItem[] = [
  { label: "MAAX Studio", href: "/products/maax-studio" },
  { label: "Lyra", href: "/products/lyra" },
];
