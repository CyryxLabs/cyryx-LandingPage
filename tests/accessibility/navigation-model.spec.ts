import { test, expect } from '@playwright/test';
import { 
  PRIMARY_NAVIGATION, 
  PRIMARY_NAVIGATION_CTA, 
  normalizePathname, 
  matchesPathBoundary,
  getActiveNavigationGroup,
  isPrimaryNavigationCTAActive,
  isNavigationItemActive
} from '../../src/lib/navigation';

test.describe('Navigation Model', () => {
  test('Top-level order and labels', () => {
    const labels = PRIMARY_NAVIGATION.map(g => g.label);
    expect(labels).toEqual(['Products', 'Solutions', 'Research', 'Company']);
  });

  test('Primary CTA', () => {
    expect(PRIMARY_NAVIGATION_CTA).toEqual({ label: 'Start a Project', href: '/start' });
  });

  test('Normalization', () => {
    expect(normalizePathname('/products/')).toBe('/products');
    expect(normalizePathname('/products/?ref=test')).toBe('/products');
    expect(normalizePathname('/products/maax-studio#overview')).toBe('/products/maax-studio');
    expect(normalizePathname('products/lyra')).toBe('products/lyra');
    expect(normalizePathname('/')).toBe('/');
  });

  test('Segment safety', () => {
    expect(matchesPathBoundary('/productivity', '/products')).toBe(false);
    expect(matchesPathBoundary('/products/lyra', '/products')).toBe(true);
  });

  test('Active group mapping', () => {
    expect(getActiveNavigationGroup('/products/maax-studio')).toBe('products');
    expect(getActiveNavigationGroup('/managed-operations')).toBe('solutions');
    expect(getActiveNavigationGroup('/answers')).toBe('research');
    expect(getActiveNavigationGroup('/contact')).toBe('company');
    expect(getActiveNavigationGroup('/start')).toBeNull();
  });

  test('CTA active behavior', () => {
    expect(isPrimaryNavigationCTAActive('/start')).toBe(true);
    expect(isPrimaryNavigationCTAActive('/start/details')).toBe(true);
    expect(isPrimaryNavigationCTAActive('/starting')).toBe(false);
  });

  test('Child active engine', () => {
    expect(isNavigationItemActive('/products/maax-studio', '/products/maax-studio')).toBe(true);
    expect(isNavigationItemActive('/products/maax-studio', '/products')).toBe(false);
    expect(isNavigationItemActive('/research/article', '/research')).toBe(true);
  });
});
