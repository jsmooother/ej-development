import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Privacy Policy | EJ Properties",
  description: "Learn about how EJ Properties collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl font-light text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            EJ Properties ("we," "our," or "us") is committed to protecting your privacy and personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
            you visit our website or use our services.
          </p>

          <h2>Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us, including:
          </p>
          <ul>
            <li>Name and contact information (email address, phone number, mailing address)</li>
            <li>Property preferences and requirements</li>
            <li>Communication preferences</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, we may automatically collect certain information, including:
          </p>
          <ul>
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on our website</li>
            <li>Referring website or source</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            We use the collected information for various purposes, including:
          </p>
          <ul>
            <li>Providing and maintaining our services</li>
            <li>Responding to your inquiries and requests</li>
            <li>Personalizing your experience on our website</li>
            <li>Analyzing website usage and improving our services</li>
            <li>Marketing communications (with your consent)</li>
            <li>Legal compliance and fraud prevention</li>
          </ul>

          <h2>Legal Basis for Processing</h2>
          <p>
            Under GDPR, we process your personal data based on the following legal grounds:
          </p>
          <ul>
            <li><strong>Consent:</strong> When you have given clear consent for us to process your data</li>
            <li><strong>Contract:</strong> When processing is necessary for the performance of a contract</li>
            <li><strong>Legitimate Interest:</strong> When we have a legitimate business interest in processing your data</li>
            <li><strong>Legal Obligation:</strong> When processing is required by law</li>
          </ul>

          <h2>Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties, except:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To trusted service providers who assist us in operating our website and conducting our business</li>
            <li>When required by law or to protect our rights and safety</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against:
          </p>
          <ul>
            <li>Unauthorized access, use, or disclosure</li>
            <li>Accidental loss or destruction</li>
            <li>Malicious attacks and data breaches</li>
          </ul>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure. 
            While we strive to protect your information, we cannot guarantee absolute security.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless:
          </p>
          <ul>
            <li>A longer retention period is required by law</li>
            <li>You request deletion of your information</li>
            <li>We need to retain information for legitimate business purposes</li>
          </ul>

          <h2>Your Rights</h2>
          <p>
            Under applicable data protection laws, you have the following rights:
          </p>
          <ul>
            <li><strong>Right of Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Rights Related to Automated Decision Making:</strong> Request human review of automated decisions</li>
          </ul>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience and analyze website traffic. 
            For detailed information about our cookie practices, please see our <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites or services. We are not responsible for the privacy 
            practices or content of these third parties. We encourage you to review their privacy policies before 
            providing any personal information.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            Your personal information may be transferred to and processed in countries other than your country of residence. 
            We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not directed to children under 16 years of age. We do not knowingly collect personal 
            information from children under 16. If you become aware that a child has provided us with personal information, 
            please contact us immediately.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending you an email notification (if applicable)</li>
            <li>Displaying a prominent notice on our website</li>
          </ul>

          <h2>Contact Information</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@ejproperties.com" className="text-blue-600 hover:underline">privacy@ejproperties.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+34600123456" className="text-blue-600 hover:underline">+34 600 123 456</a></li>
              <li><strong>Address:</strong> EJ Properties, Marbella, Spain</li>
              <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@ejproperties.com" className="text-blue-600 hover:underline">dpo@ejproperties.com</a></li>
            </ul>
          </div>

          <h2>Complaints</h2>
          <p>
            If you are not satisfied with how we handle your personal information, you have the right to lodge a complaint 
            with your local data protection authority. In Spain, this is the Agencia Española de Protección de Datos (AEPD).
          </p>
        </div>
      </div>
    </main>
  );
}
