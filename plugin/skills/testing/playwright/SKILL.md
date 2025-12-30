---
name: playwright
description: Playwright E2E testing with browser automation, visual regression, API testing, and CI integration
category: testing
triggers:
  - playwright
  - e2e testing
  - browser automation
  - end-to-end
  - visual testing
  - cross-browser testing
---

# Playwright

Enterprise-grade **E2E testing framework** following industry best practices. This skill covers browser automation, visual regression testing, API testing, network interception, and CI/CD integration patterns used by top engineering teams.

## Purpose

Build reliable end-to-end test suites:

- Write resilient E2E tests with auto-waiting
- Implement Page Object Model patterns
- Configure cross-browser and mobile testing
- Set up visual regression testing
- Integrate with CI/CD pipelines
- Mock APIs and intercept network requests
- Generate test reports and traces

## Features

### 1. Configuration Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "junit.xml" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Pro 11"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 2. Page Object Model

```typescript
// tests/pages/base.page.ts
import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  constructor(protected page: Page) {}

  abstract get url(): string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

// tests/pages/login.page.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Sign in" });
    this.errorMessage = page.getByRole("alert");
    this.forgotPasswordLink = page.getByRole("link", { name: "Forgot password?" });
    this.rememberMeCheckbox = page.getByLabel("Remember me");
  }

  get url(): string {
    return "/login";
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.rememberMeCheckbox.check();
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}

// tests/pages/dashboard.page.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly navigationItems: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByTestId("welcome-message");
    this.userMenu = page.getByTestId("user-menu");
    this.logoutButton = page.getByRole("button", { name: "Logout" });
    this.navigationItems = page.getByRole("navigation").getByRole("link");
    this.searchInput = page.getByPlaceholder("Search...");
  }

  get url(): string {
    return "/dashboard";
  }

  async expectWelcomeMessage(name: string): Promise<void> {
    await expect(this.welcomeMessage).toContainText(`Welcome, ${name}`);
  }

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async navigateTo(item: string): Promise<void> {
    await this.navigationItems.filter({ hasText: item }).click();
  }
}
```

### 3. Test Fixtures

```typescript
// tests/fixtures/auth.fixture.ts
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";

interface TestUser {
  email: string;
  password: string;
  name: string;
}

interface AuthFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  testUser: TestUser;
  authenticatedPage: DashboardPage;
}

export const test = base.extend<AuthFixtures>({
  testUser: {
    email: "test@example.com",
    password: "SecurePassword123!",
    name: "Test User",
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Login via API for faster test setup
    const response = await page.request.post("/api/auth/login", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    const { token } = await response.json();

    // Set auth cookie/storage
    await page.context().addCookies([
      {
        name: "auth_token",
        value: token,
        domain: "localhost",
        path: "/",
      },
    ]);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await use(dashboardPage);
  },
});

export { expect };
```

### 4. API Mocking and Network Interception

```typescript
// tests/e2e/api-mocking.spec.ts
import { test, expect } from "@playwright/test";

test.describe("API Mocking", () => {
  test("mock successful API response", async ({ page }) => {
    await page.route("**/api/users", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [
            { id: 1, name: "John Doe", email: "john@example.com" },
            { id: 2, name: "Jane Smith", email: "jane@example.com" },
          ],
        }),
      })
    );

    await page.goto("/users");

    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("Jane Smith")).toBeVisible();
  });

  test("mock API error response", async ({ page }) => {
    await page.route("**/api/users", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      })
    );

    await page.goto("/users");

    await expect(page.getByText("Failed to load users")).toBeVisible();
  });

  test("intercept and modify requests", async ({ page }) => {
    await page.route("**/api/search**", (route) => {
      const url = new URL(route.request().url());
      url.searchParams.set("limit", "10");

      route.continue({ url: url.toString() });
    });

    await page.goto("/search");
    await page.fill('[name="query"]', "test");
    await page.click('button[type="submit"]');

    // Verify modified request was made
  });

  test("delay API response", async ({ page }) => {
    await page.route("**/api/slow-endpoint", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: "delayed response" }),
      });
    });

    await page.goto("/slow-page");

    // Verify loading state appears
    await expect(page.getByTestId("loading-spinner")).toBeVisible();

    // Verify content appears after delay
    await expect(page.getByText("delayed response")).toBeVisible({
      timeout: 5000,
    });
  });

  test("capture and assert network requests", async ({ page }) => {
    const requestPromise = page.waitForRequest("**/api/analytics");

    await page.goto("/dashboard");

    const request = await requestPromise;
    const postData = request.postDataJSON();

    expect(postData).toMatchObject({
      event: "page_view",
      page: "/dashboard",
    });
  });

  test("wait for specific response", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/data") && response.status() === 200
    );

    await page.goto("/data-page");

    const response = await responsePromise;
    const data = await response.json();

    expect(data).toHaveProperty("items");
  });
});
```

### 5. Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    });
  });

  test("homepage visual snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("component visual snapshot", async ({ page }) => {
    await page.goto("/components/button");

    const button = page.getByTestId("primary-button");
    await expect(button).toHaveScreenshot("primary-button.png");

    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot("primary-button-hover.png");

    // Focus state
    await button.focus();
    await expect(button).toHaveScreenshot("primary-button-focus.png");
  });

  test("responsive visual snapshots", async ({ page }) => {
    await page.goto("/");

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot("homepage-desktop.png");

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot("homepage-tablet.png");

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot("homepage-mobile.png");
  });

  test("dark mode visual snapshot", async ({ page }) => {
    await page.goto("/");

    // Toggle dark mode
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForSelector('[data-theme="dark"]');

    await expect(page).toHaveScreenshot("homepage-dark-mode.png", {
      fullPage: true,
    });
  });

  test("mask dynamic content", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveScreenshot("dashboard.png", {
      mask: [
        page.getByTestId("timestamp"),
        page.getByTestId("user-avatar"),
        page.getByTestId("random-content"),
      ],
    });
  });
});
```

### 6. Authentication and Session Management

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "../fixtures/auth.fixture";

test.describe("Authentication Flow", () => {
  test("successful login redirects to dashboard", async ({ page, loginPage, testUser }) => {
    await loginPage.navigate();
    await loginPage.login(testUser.email, testUser.password);

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("welcome-message")).toContainText(
      testUser.name
    );
  });

  test("invalid credentials show error message", async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login("wrong@example.com", "wrongpassword");

    await loginPage.expectErrorMessage("Invalid email or password");
  });

  test("logout clears session", async ({ page, authenticatedPage }) => {
    await authenticatedPage.logout();

    await expect(page).toHaveURL("/login");

    // Verify session is cleared by trying to access protected route
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("remember me persists session", async ({ page, loginPage, testUser, context }) => {
    await loginPage.navigate();
    await loginPage.loginWithRememberMe(testUser.email, testUser.password);

    // Create new page in same context (simulates new tab)
    const newPage = await context.newPage();
    await newPage.goto("/dashboard");

    await expect(newPage).toHaveURL("/dashboard");
    await newPage.close();
  });

  test("session expires after timeout", async ({ page, authenticatedPage }) => {
    // Mock session expiration
    await page.route("**/api/session/check", (route) =>
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: "Session expired" }),
      })
    );

    // Trigger session check
    await page.click('[data-testid="refresh-data"]');

    await expect(page.getByText("Session expired")).toBeVisible();
  });
});

// tests/auth.setup.ts - Global auth setup
import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");

  await page.context().storageState({ path: authFile });
});
```

### 7. Form and User Interaction Testing

```typescript
// tests/e2e/forms.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Form Interactions", () => {
  test("complete multi-step form", async ({ page }) => {
    await page.goto("/onboarding");

    // Step 1: Personal Info
    await page.fill('[name="firstName"]', "John");
    await page.fill('[name="lastName"]', "Doe");
    await page.fill('[name="email"]', "john.doe@example.com");
    await page.click('button:has-text("Next")');

    // Step 2: Preferences
    await page.check('[name="newsletter"]');
    await page.selectOption('[name="timezone"]', "America/New_York");
    await page.click('button:has-text("Next")');

    // Step 3: Confirmation
    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("john.doe@example.com")).toBeVisible();
    await page.click('button:has-text("Complete")');

    await expect(page).toHaveURL("/welcome");
  });

  test("form validation errors", async ({ page }) => {
    await page.goto("/register");

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check validation messages
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    // Fill invalid email
    await page.fill('[name="email"]', "invalid-email");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Invalid email format")).toBeVisible();

    // Fill weak password
    await page.fill('[name="email"]', "valid@example.com");
    await page.fill('[name="password"]', "123");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
  });

  test("file upload", async ({ page }) => {
    await page.goto("/upload");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-file.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("PDF content"),
    });

    await expect(page.getByText("test-file.pdf")).toBeVisible();
    await page.click('button:has-text("Upload")');

    await expect(page.getByText("Upload successful")).toBeVisible();
  });

  test("drag and drop", async ({ page }) => {
    await page.goto("/kanban");

    const sourceCard = page.locator('[data-testid="card-1"]');
    const targetColumn = page.locator('[data-testid="done-column"]');

    await sourceCard.dragTo(targetColumn);

    await expect(targetColumn.locator('[data-testid="card-1"]')).toBeVisible();
  });

  test("autocomplete interaction", async ({ page }) => {
    await page.goto("/search");

    await page.fill('[name="search"]', "pla");
    await expect(page.getByRole("listbox")).toBeVisible();

    const suggestions = page.getByRole("option");
    await expect(suggestions).toHaveCount(5);

    await suggestions.filter({ hasText: "Playwright" }).click();
    await expect(page.locator('[name="search"]')).toHaveValue("Playwright");
  });
});
```

## Use Cases

### CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npx playwright test
        env:
          BASE_URL: http://localhost:3000
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload test traces
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-traces
          path: test-results/
```

### Accessibility Testing

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("homepage has no accessibility violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("form has proper labels", async ({ page }) => {
    await page.goto("/contact");

    const results = await new AxeBuilder({ page })
      .include("form")
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAttribute("role", "link");

    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAttribute("role", "button");

    // Activate with Enter
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/about/);
  });
});
```

## Best Practices

### Do's

- Use Page Object Model for maintainable tests
- Prefer user-facing locators (getByRole, getByLabel)
- Set up proper test isolation with fixtures
- Use API authentication for faster test setup
- Enable traces and screenshots for debugging
- Run tests in parallel for faster execution
- Implement visual regression for UI consistency
- Use test.describe for logical grouping
- Mock external APIs for reliable tests
- Test across multiple browsers and devices

### Don'ts

- Don't use fragile CSS selectors
- Don't rely on timing with arbitrary waits
- Don't share state between tests
- Don't test third-party services directly
- Don't skip flaky tests without investigating
- Don't ignore accessibility testing
- Don't hardcode test data
- Don't run all browsers in CI by default
- Don't ignore test failures in PRs
- Don't forget to clean up test artifacts

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
