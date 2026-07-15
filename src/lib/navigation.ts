export type NavigationGroupId = 'products' | 'solutions' | 'research' | 'company';

export type NavigationItem = {
  readonly label: string;
  readonly href: string;
};

export type NavigationGroup = {
  readonly id: NavigationGroupId;
  readonly label: string;
  readonly children: readonly NavigationItem[];
};

export type NavigationCTA = {
  readonly label: string;
  readonly href: string;
};

export const PRIMARY_NAVIGATION: readonly NavigationGroup[] = [
  {
    id: 'products',
    label: 'Products',
    children: [
      { label: 'Products Overview', href: '/products' },
      { label: 'MAAX Studio', href: '/products/maax-studio' },
      { label: 'Lyra', href: '/products/lyra' },
    ] as const,
  },
  {
    id: 'solutions',
    label: 'Solutions',
    children: [
      { label: 'Digital & Web Systems', href: '/solutions/digital-web-systems' },
      { label: 'Workflow Automation', href: '/solutions/workflow-automation' },
      { label: 'Internal AI Assistants', href: '/solutions/internal-ai-assistants' },
      { label: 'Custom AI Product Development', href: '/solutions/custom-ai-product-development' },
      { label: 'AI Governance & Cost Control', href: '/solutions/ai-governance-cost-control' },
      { label: 'Managed Operations', href: '/managed-operations' },
      { label: 'How We Work', href: '/engagement-model' },
    ] as const,
  },
  {
    id: 'research',
    label: 'Research',
    children: [
      { label: 'Research', href: '/research' },
      { label: 'Answers', href: '/answers' },
    ] as const,
  },
  {
    id: 'company',
    label: 'Company',
    children: [
      { label: 'Company', href: '/company' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ] as const,
  },
] as const;

export const PRIMARY_NAVIGATION_CTA: NavigationCTA = {
  label: 'Start a Project',
  href: '/start',
} as const;

export function normalizePathname(pathname: string): string {
  let path = pathname.split('?')[0].split('#')[0];
  path = path.replace(/\/+/g, '/');
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path || '/';
}

export function matchesPathBoundary(pathname: string, basePath: string): boolean {
  const normPath = normalizePathname(pathname);
  const normBase = normalizePathname(basePath);
  if (normPath === normBase) return true;
  return normPath.startsWith(normBase + '/');
}

export function getActiveNavigationGroup(pathname: string): NavigationGroupId | null {
  const path = normalizePathname(pathname);
  
  if (matchesPathBoundary(path, '/products')) return 'products';
  
  if (
    matchesPathBoundary(path, '/solutions') ||
    matchesPathBoundary(path, '/managed-operations') ||
    matchesPathBoundary(path, '/engagement-model')
  ) return 'solutions';
  
  if (
    matchesPathBoundary(path, '/research') ||
    matchesPathBoundary(path, '/answers')
  ) return 'research';
  
  if (
    matchesPathBoundary(path, '/company') ||
    matchesPathBoundary(path, '/careers') ||
    matchesPathBoundary(path, '/contact')
  ) return 'company';

  return null;
}

export function isPrimaryNavigationCTAActive(pathname: string): boolean {
  return matchesPathBoundary(normalizePathname(pathname), '/start');
}

export function isNavigationItemActive(pathname: string, href: string): boolean {
  const path = normalizePathname(pathname);
  const itemHref = normalizePathname(href);
  
  // Rule from Section 11:
  // - "Exact match activates the child."
  // - "A nested route beneath the child may activate it."
  // - "Special handling is required for overview routes."
  // 
  // For Products Overview (/products) specifically:
  // It is active ONLY at exactly /products.
  // At /products/lyra, Lyra is active but Products Overview is NOT.
  if (itemHref === '/products') {
    return path === '/products';
  }

  // Other overview routes or children follow segment-safe matching
  return matchesPathBoundary(path, itemHref);
}


