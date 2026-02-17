// e2e/pages/HomePage.js
export class HomePage {
  constructor(page) {
    this.page = page;
    this.simulatorNavLink = page.getByRole('link', { name: 'Simulator' }).filter({ visible: true });
    this.electionsNavLink = page.getByRole('link', { name: 'Elections' }).filter({ visible: true });
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
