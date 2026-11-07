
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how DueBird collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <article className="max-w-3xl mx-auto prose prose-neutral">
        <h1>Privacy Policy</h1>
        <p>Last updated: November 6, 2026</p>

        <p>
          DueBird is a homework and assignment organization service.
          This Privacy Policy explains what information we collect,
          how we use it, and the choices available to you when using
          DueBird.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>Account information</h3>
        <p>
          When you create an account, we collect information such as
          your email address and display name. You can register using
          email and password or Google sign-in.
        </p>

        <h3>Class and assignment information</h3>
        <p>
          DueBird stores information you or your classmates submit,
          including class names, class periods, teacher names,
          assignment titles, descriptions, due dates, and completion
          information.
        </p>
        <p>
          Information shared within a class may be visible to other
          members of that class. Class members can create, view, edit,
          and delete assignments in their shared class.
        </p>

        <h3>Technical and analytics information</h3>
        <p>
          DueBird uses browser storage to generate a persistent visitor
          identifier and a session identifier. These identifiers help
          us understand how the service is used.
        </p>
        <p>
          We collect events such as visits, sign-ups, class creation,
          class joining, and assignment creation and completion.
          When you are signed in, analytics events may be associated
          with your account identifier.
        </p>
        <p>
          Your browser may also store authentication and display
          preferences, such as your selected theme.
        </p>

        <h2>2. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide and operate DueBird.</li>
          <li>Authenticate users and maintain accounts.</li>
          <li>Organize classes and assignments.</li>
          <li>Allow classmates to collaborate on shared assignments.</li>
          <li>Understand usage and improve the service.</li>
          <li>Protect the service against abuse and unauthorized access.</li>
          <li>Respond to support requests and legal obligations.</li>
        </ul>

        <h2>3. How Information Is Shared</h2>
        <p>
          Class information and assignments are shared with members
          of the relevant DueBird class as part of the service.
        </p>
        <p>
          We use third-party providers to operate DueBird, including
          Supabase for authentication and database services, Vercel
          for hosting, and Google when users choose Google sign-in.
          These providers may process information as necessary to
          provide their services.
        </p>
        <p>
          We do not sell personal information for money. We may
          disclose information when required by law or when reasonably
          necessary to protect the service, its users, or others.
        </p>

        <h2>4. Invite Links</h2>
        <p>
          DueBird uses class invite codes and links. Opening a valid
          invite link may display limited class information, such as
          the class name, period, and member count, before someone
          joins. Do not share invite links with people you do not
          want to have access to this preview.
        </p>

        <h2>5. Cookies and Browser Storage</h2>
        <p>
          DueBird uses browser storage and authentication cookies
          to support sign-in, remember preferences, and measure
          service usage. Disabling browser storage or cookies may
          affect some features.
        </p>

        <h2>6. Data Retention and Deletion</h2>
        <p>
          We retain information for as long as reasonably necessary
          to operate DueBird, maintain accounts, provide class
          collaboration, resolve disputes, and meet applicable
          legal obligations.
        </p>
        <p>
          You may contact us to request access to, correction of,
          or deletion of personal information. Some information
          may need to be retained where required by law or where
          necessary to protect the service.
        </p>
        <p>
          Deletion procedures and retention periods may depend on
          the type of information and whether it is part of a
          shared class.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
          DueBird is intended for people who are at least 13 years
          old. It is not intended for children under 13, and we
          do not knowingly collect personal information from
          children under 13.
        </p>
        <p>
          If you believe a child under 13 has provided personal
          information to DueBird, please contact us so we can
          investigate and take appropriate action.
        </p>
        <p>
          Users under 18 should have permission from a parent or
          legal guardian before using the service.
        </p>

        <h2>8. Security</h2>
        <p>
          We use technical and organizational measures intended
          to protect information. However, no online service or
          method of electronic storage can be guaranteed to be
          completely secure.
        </p>

        <h2>9. Your Choices and Rights</h2>
        <p>
          Depending on where you live, you may have rights to
          access, correct, delete, or obtain a copy of your
          personal information. You may also have rights to
          object to or restrict certain processing.
        </p>
        <p>
          To make a privacy request, contact us using the address
          below. We may need to verify your identity before
          fulfilling a request.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy as DueBird changes.
          We will update the date at the top when changes are made.
          Continued use of the service after an update does not
          eliminate any rights you have under applicable law.
        </p>

        <h2>11. Contact</h2>
        <p>
          For privacy questions or requests, contact:
          <br />
          myduebird@gmail.com
        </p>
      </article>
    </main>
  );
}
