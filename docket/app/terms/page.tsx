
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using DueBird.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <article className="max-w-3xl mx-auto prose prose-neutral">
        <h1>Terms of Service</h1>
        <p>Last updated: November 6, 2026</p>

        <p>
          Welcome to DueBird. These Terms of Service explain the
          rules for using DueBird, a service for organizing and
          sharing classes and assignments.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years old to create or use a
          DueBird account. If you are under 18, you should have
          permission from a parent or legal guardian before using
          the service.
        </p>
        <p>
          By using DueBird, you confirm that you meet these
          eligibility requirements.
        </p>

        <h2>2. Your Account</h2>
        <p>
          You are responsible for maintaining the security of
          your account and for activity that occurs through it.
          Do not share your password or attempt to access another
          person's account.
        </p>
        <p>
          You agree to provide accurate account information and
          to notify us if you believe your account has been
          accessed without permission.
        </p>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use DueBird for unlawful purposes.</li>
          <li>Attempt to access accounts or data without permission.</li>
          <li>Disrupt, damage, or interfere with the service.</li>
          <li>Exploit bugs or vulnerabilities to access information.</li>
          <li>Use the service to harass, threaten, or impersonate others.</li>
          <li>Submit content that violates another person's rights.</li>
          <li>Abuse class invite links or automated features.</li>
        </ul>

        <h2>4. Classes and Shared Assignments</h2>
        <p>
          DueBird allows users to create and join shared classes.
          Members of a class can create, view, edit, and delete
          assignments within that class.
        </p>
        <p>
          Only share class information and invite links with
          people you intend to have access to the class.
          Do not submit private or sensitive information that
          is unnecessary for organizing assignments.
        </p>
        <p>
          You are responsible for the content you submit and
          should only submit information you are permitted
          to share.
        </p>

        <h2>5. Assignment Accuracy</h2>
        <p>
          DueBird is an organizational tool. It is not an official
          school record, learning management system, or guaranteed
          source of assignment information.
        </p>
        <p>
          DueBird does not guarantee that assignments, descriptions,
          due dates, or completion information are accurate,
          complete, or up to date.
        </p>
        <p>
          Always verify important assignment information and
          deadlines with your teacher or school's official
          communication channels.
        </p>

        <h2>6. Your Content</h2>
        <p>
          You retain ownership of content you submit to DueBird,
          subject to any rights belonging to other people.
        </p>
        <p>
          You grant DueBird permission to store, process, display,
          and transmit that content as necessary to operate the
          service and provide its features, including sharing
          assignments with members of your classes.
        </p>

        <h2>7. Service Availability</h2>
        <p>
          DueBird is provided free of charge at this time.
          We may change, suspend, or discontinue features or
          the service. We do not guarantee uninterrupted
          availability or permanent storage of information.
        </p>

        <h2>8. Account Suspension and Termination</h2>
        <p>
          We may restrict or suspend access when reasonably
          necessary to protect DueBird, its users, or the
          security of the service, or to address violations
          of these Terms or applicable law.
        </p>
        <p>
          You may stop using DueBird at any time. Account
          deletion and associated data handling are described
          in our Privacy Policy.
        </p>

        <h2>9. Disclaimer</h2>
        <p>
          To the extent permitted by applicable law, DueBird
          is provided on an "as is" and "as available" basis.
          We do not guarantee that the service will always be
          available, error-free, or suitable for every purpose.
        </p>
        <p>
          Nothing in these Terms excludes warranties or rights
          that cannot legally be excluded.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the extent permitted by applicable law, DueBird
          and its operators will not be liable for indirect,
          incidental, special, or consequential damages arising
          from the use of the service.
        </p>
        <p>
          Nothing in these Terms limits liability or rights
          that cannot legally be limited or excluded.
        </p>

        <h2>11. Changes to These Terms</h2>
        <p>
          We may update these Terms as DueBird evolves.
          The updated version will be posted on this page
          with a revised date.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions about these Terms, contact:
          <br />
          myduebird@gmail.com
        </p>
      </article>
    </main>
  );
}
