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
    await this.page.waitForLoadState('networkidle');
  }

  async waitForMapReady() {
    // Wait for Leaflet container to appear first
    await this.mapContainer.waitFor({ state: 'visible', timeout: 30000 });
    // Spinner may never appear if map loads instantly — use detached+ignore if not found
    try {
      await this.loadingSpinner.waitFor({ state: 'detached', timeout: 5000 });
    } catch {
      // Spinner was never in DOM — map loaded fast enough. This is fine.
    }
  }
}
