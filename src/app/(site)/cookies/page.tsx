import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | EJ Properties",
  description: "Learn about how EJ Properties uses cookies to enhance your browsing experience.",
};

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl font-light text-foreground">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
            They are widely used to make websites work more efficiently and to provide information to website owners.
          </p>

          <h2>How We Use Cookies</h2>
          <p>
            EJ Properties uses cookies to enhance your browsing experience, analyze website traffic, and provide 
            personalized content. We are committed to being transparent about our use of cookies and giving you 
            control over your privacy preferences.
          </p>

          <h2>Types of Cookies We Use</h2>
          
          <h3>1. Necessary Cookies</h3>
          <p>
            These cookies are essential for the website to function properly. They enable basic functions like 
            page navigation, access to secure areas, and remembering your cookie preferences. The website cannot 
            function properly without these cookies.
          </p>
          <ul>
            <li><strong>Purpose:</strong> Essential website functionality</li>
            <li><strong>Duration:</strong> Session or up to 1 year</li>
            <li><strong>Can be disabled:</strong> No (required for website operation)</li>
          </ul>

          <h3>2. Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting and reporting 
            information anonymously. This helps us improve our website's performance and user experience.
          </p>
          <ul>
            <li><strong>Purpose:</strong> Website analytics and performance monitoring</li>
            <li><strong>Duration:</strong> Up to 2 years</li>
            <li><strong>Can be disabled:</strong> Yes (via cookie preferences)</li>
            <li><strong>Data collected:</strong> Page views, time on site, referral sources, device information</li>
          </ul>

          <h3>3. Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization, such as remembering your preferences 
            and providing improved features.
          </p>
          <ul>
            <li><strong>Purpose:</strong> Enhanced user experience and personalization</li>
            <li><strong>Duration:</strong> Up to 1 year</li>
            <li><strong>Can be disabled:</strong> Yes (via cookie preferences)</li>
          </ul>

          <h3>4. Marketing Cookies</h3>
          <p>
            These cookies are used to track visitors across websites for advertising purposes. They help us 
            deliver relevant advertisements and measure the effectiveness of our marketing campaigns.
          </p>
          <ul>
            <li><strong>Purpose:</strong> Advertising and marketing optimization</li>
            <li><strong>Duration:</strong> Up to 1 year</li>
            <li><strong>Can be disabled:</strong> Yes (via cookie preferences)</li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies on our website are set by third-party services. These may include:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
            <li><strong>Social Media Platforms:</strong> For social sharing and integration features</li>
            <li><strong>Content Delivery Networks:</strong> For faster website loading and performance</li>
          </ul>

          <h2>Managing Your Cookie Preferences</h2>
          <p>
            You can control and manage cookies in several ways:
          </p>
          
          <h3>Cookie Banner</h3>
          <p>
            When you first visit our website, you'll see a cookie consent banner that allows you to:
          </p>
          <ul>
            <li>Accept all cookies</li>
            <li>Reject all non-essential cookies</li>
            <li>Manage your preferences for different cookie categories</li>
          </ul>

          <h3>Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>Block all cookies</li>
            <li>Allow only first-party cookies</li>
            <li>Delete existing cookies</li>
            <li>Set your browser to notify you when cookies are being set</li>
          </ul>

          <h3>Opt-Out Links</h3>
          <p>
            For specific third-party services, you can opt out directly:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
            <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ad Settings</a></li>
          </ul>

          <h2>Data Protection</h2>
          <p>
            We are committed to protecting your privacy and personal data. Our use of cookies is governed by:
          </p>
          <ul>
            <li>Our Privacy Policy</li>
            <li>EU General Data Protection Regulation (GDPR)</li>
            <li>UK Data Protection Act 2018</li>
            <li>Other applicable data protection laws</li>
          </ul>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for 
            other operational, legal, or regulatory reasons. We will notify you of any material changes by 
            posting the updated policy on our website.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@ejproperties.com">privacy@ejproperties.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+34600123456">+34 600 123 456</a></li>
            <li><strong>Address:</strong> EJ Properties, Marbella, Spain</li>
          </ul>

          <div className="mt-12 rounded-lg bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Cookie Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can update your cookie preferences at any time by clicking the button below.
            </p>
            <button 
              onClick={() => {
                // Clear current preferences to show cookie banner again
                localStorage.removeItem('cookie-consent');
                window.location.reload();
              }}
              className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Update Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
