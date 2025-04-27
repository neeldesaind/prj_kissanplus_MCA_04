import { NavLink } from "react-router";

function TermsAndConditions() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className="terms-and-conditions container mx-auto px-4 py-10">
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-green-600 mb-6">
          Terms and Conditions
        </h1>
        <p className="text-lg font-light mb-6">
          Last Updated: December 09,2024
        </p>

        <p className="mb-6">
          Welcome to <strong>Kissan Plus</strong>! These Terms and Conditions
          Terms govern your access to and use of our services, including the
          website, mobile application, and other platforms (collectively
          referred to as the Service. By accessing or using our Service, you
          agree to comply with these Terms. If you do not agree to these Terms,
          you may not use the Service.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="mb-6">
          By accessing or using the Kissan Plus platform, you agree to be bound
          by these Terms and any additional guidelines, terms, or policies that
          apply to specific services or features within the platform. We reserve
          the right to modify or update these Terms at any time. You are
          responsible for reviewing these Terms regularly. Continued use of the
          platform following any changes will be considered as your acceptance
          of those changes.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          2. User Registration
        </h2>
        <p className="mb-6">
          To use certain features of the Service, you may be required to create
          an account. You must provide accurate and complete information during
          the registration process and keep your account information updated.
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities under your account.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          3. Use of Service
        </h2>
        <p className="mb-6">
          The Service is provided for legitimate agricultural, administrative,
          and community-related purposes. You agree to use the Service only for
          lawful purposes and in accordance with these Terms. You must not:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Violate any laws or regulations.</li>
          <li>
            Engage in any activity that disrupts, damages, or interferes with
            the platform or its users.
          </li>
          <li>Use the Service for fraudulent or malicious activities.</li>
          <li>Infringe upon the intellectual property rights of others.</li>
        </ul>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          4. Privacy Policy
        </h2>
        <p className="mb-6">
          Your privacy is important to us. Our Privacy Policy, which outlines
          how we collect, use, and protect your personal information, is
          incorporated into these Terms. By using the Service, you agree to the
          practices outlined in our Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          5. Limitations of Liability
        </h2>
        <p className="mb-6">
          Kissan Plus will not be held liable for any damages or losses arising
          from the use of the Service. We do not guarantee the accuracy,
          completeness, or reliability of the information provided through the
          platform. You use the Service at your own risk.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          6. Modifications to the Service
        </h2>
        <p className="mb-6">
          We reserve the right to modify, suspend, or discontinue any part of
          the Service at our discretion. We may also update these Terms to
          reflect changes in our services, policies, or legal requirements. Any
          such changes will be effective immediately upon posting on this page.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          7. Governing Law
        </h2>
        <p className="mb-6">
          These Terms will be governed by and construed in accordance with the
          laws of [Insert Jurisdiction], without regard to its conflict of law
          principles.
        </p>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          8. Contact Information
        </h2>
        <p className="mb-6">
          If you have any questions or concerns about these Terms and
          Conditions, please contact us at contact@kissanplus.com.
        </p>

        <div className="flex justify-center mt-6">
          <NavLink
            to="/"
            onClick={scrollToTop}  
            className="px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-400 inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </NavLink>
        </div>
      </section>
    </div>
  );
}

export default TermsAndConditions;
