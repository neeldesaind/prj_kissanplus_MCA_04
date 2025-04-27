import { NavLink } from "react-router";

function PrivacyPolicy() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy for Kissan Plus</h1>
        <p className="mt-4 text-lg text-gray-600">
          Last updated: December 09, 2024
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
          <p className="mt-2 text-gray-600">
            At Kissan Plus, we value your privacy and are committed to protecting the personal information you share with us. This privacy policy explains how we collect, use, and safeguard your data when you use our services.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
          <p className="mt-2 text-gray-600">
            We collect the following types of information to provide and improve our services:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Personal information such as your name, contact information, and other details required for service access.</li>
            <li>Non-personal information such as your IP address, device type, and usage data related to how you interact with Kissan Plus.</li>
            <li>Cookies and tracking technologies to help us enhance your experience and remember your preferences.</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
          <p className="mt-2 text-gray-600">
            We use the information we collect for the following purposes:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>To provide you with personalized services and improve your experience with Kissan Plus.</li>
            <li>To communicate with you, including responding to queries, updates on services, and other important notifications.</li>
            <li>To comply with applicable laws, enforce our terms of service, and prevent fraud or illegal activities.</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Data Security</h2>
          <p className="mt-2 text-gray-600">
            We take reasonable steps to protect your personal information and ensure its confidentiality. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Third-Party Disclosure</h2>
          <p className="mt-2 text-gray-600">
            Kissan Plus does not sell, rent, or lease your personal data to third parties. We may share information with trusted third-party partners for the following reasons:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Service providers that assist us in operating Kissan Plus.</li>
            <li>When required by law enforcement or to comply with legal obligations.</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Your Rights</h2>
          <p className="mt-2 text-gray-600">
            You have the right to:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Request access to your personal information.</li>
            <li>Request corrections or deletions of your data.</li>
            <li>Withdraw consent for processing your personal data where applicable.</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Cookies and Tracking Technologies</h2>
          <p className="mt-2 text-gray-600">
            Kissan Plus uses cookies and similar tracking technologies to improve your user experience and personalize the services we provide. You can disable cookies in your browser settings, but doing so may impact your ability to use some features of the site.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Changes to This Privacy Policy</h2>
          <p className="mt-2 text-gray-600">
            We may update this privacy policy periodically. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy regularly for any updates.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
          <p className="mt-2 text-gray-600">
            If you have any questions about this Privacy Policy or wish to exercise any of your rights, please contact us at:
          </p>
          <p className="mt-2 text-gray-600">
            Email: contact@kissanplus.com
          </p>
        </div>

        <div className="mt-8">
          <NavLink
            to="/"
            onClick={scrollToTop}  
            className="inline-flex items-center justify-center px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-400"
          >
            <i className="fas fa-arrow-left text-white mr-2"></i>
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
