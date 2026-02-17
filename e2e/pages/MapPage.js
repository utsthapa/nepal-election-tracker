// e2e/pages/MapPage.js
export class MapPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /nepal map/i });
    this.mapContainer = page.locator('.leaflet-container');
    this.loadingSpinner = page.getByText(/loading map/i);
  }

  async goto() {
    await this.page.goto('/nepal-map');
  }

  async waitForMapReady() {
    // Wait for loading text to disappear
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 });
  }
}
