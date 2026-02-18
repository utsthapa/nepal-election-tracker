// e2e/pages/HomePage.js
export class HomePage {
  constructor(page) {
    this.page = page;
    this.simulatorNavLink = page.getByRole('link', { name: 'Simulator' }).first();
    this.electionsNavLink = page.getByRole('link', { name: 'Elections' }).first();
    // Use href-based locator because the home page renders article links also named
    // "Analysis", and the first generic match points to "/" rather than "/analysis".
    this.analysisNavLink = page.locator('a[href="/analysis"]').first();
    this.districtsNavLink = page.getByRole('link', { name: 'Districts' }).first();
    this.demographicsNavLink = page.getByRole('link', { name: 'Demographics' }).first();
    this.nepalDataNavLink = page.getByRole('link', { name: 'Nepal Data' }).first();
    this.aboutNavLink = page.getByRole('link', { name: 'About' }).first();
    this.heading = page.getByRole('heading').first();
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSimulator() {
    await this.simulatorNavLink.click();
    await this.page.waitForURL('**/simulator');
  }

  async navigateToElections() {
    await this.electionsNavLink.click();
    await this.page.waitForURL('**/elections');
  }
}
