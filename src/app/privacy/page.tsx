import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Rydra Integrated Technologies Limited',
  description: 'Official Privacy Policy detailing how Rydra collects, uses, protects, and handles personal data in accordance with Nigerian Data Protection laws.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              RYDRA INTEGRATED TECHNOLOGIES LIMITED
            </h1>
            <p className="text-sm font-semibold text-emerald-400">Privacy Policy</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-8 border-b border-slate-800 pb-4">
          Last Updated on 24 October, 2026
        </p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Introduction</h2>
            <p className="mb-2">At Rydra, your privacy matters to us.</p>
            <p className="mb-2">
              This Privacy Policy explains how Rydra Integrated Technologies Limited (&quot;Rydra,&quot;
              &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, stores, shares, and protects
              your personal information when you use our mobile application and related services.
            </p>
            <p>
              We are committed to handling your information responsibly and in accordance with
              applicable Nigerian data protection laws.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Information We Collect</h2>
            <p className="mb-3">
              Depending on how you use Rydra, we may collect the following categories of information:
            </p>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-white">Personal Information:</span> This includes your
                name, email address, phone number, and other details provided during account
                registration.
              </div>
              <div>
                <span className="font-semibold text-white">Location Information:</span> We may process
                location information to help you book rides, arrange deliveries, identify pickup and
                destination locations, and track active trips.
              </div>
              <div>
                <span className="font-semibold text-white">Ride and Delivery Information:</span> We collect
                relevant booking information, including pickup locations, destinations, booking times,
                service status, and transaction history.
              </div>
              <div>
                <span className="font-semibold text-white">Payment Information:</span> We process information
                necessary to facilitate payments, verify transactions, handle refunds, and maintain
                financial records. Payments may be processed through authorized third-party payment
                providers.
              </div>
              <div>
                <span className="font-semibold text-white">Device and Usage Information:</span> We may
                collect technical information, such as device type, application performance, and usage
                activity, to maintain and improve our services.
              </div>
              <div>
                <span className="font-semibold text-white">Customer Support Information:</span> When you
                contact Rydra Support, we may collect the information you provide to help resolve your
                inquiry.
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">3. How We Use Your Information</h2>
            <p className="mb-2">We use relevant personal information to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Create and manage your Rydra account.</li>
              <li>Connect you with drivers and delivery partners.</li>
              <li>Facilitate rides and courier deliveries.</li>
              <li>Process payments and refunds.</li>
              <li>Provide booking confirmations and service updates.</li>
              <li>Support safety and security features.</li>
              <li>Respond to customer inquiries and complaints.</li>
              <li>Prevent fraud and unauthorized activities.</li>
              <li>Maintain and improve platform performance.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
            <p>
              We may also send promotional communications where permitted by law and your applicable
              preferences.
            </p>
          </section>

          {/* 4. Legal Basis for Processing */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Legal Basis for Processing</h2>
            <p className="mb-3">
              Depending on the information and purpose, Rydra may process personal data on one or more
              lawful bases recognized under Nigerian data protection law. These may include:
            </p>
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-white">Contractual Necessity:</span> Processing
                information required to provide services you request.
              </div>
              <div>
                <span className="font-semibold text-white">Legal Obligations:</span> Processing
                information necessary to comply with applicable laws and regulatory requirements.
              </div>
              <div>
                <span className="font-semibold text-white">Consent:</span> Processing information for
                specific purposes where your consent is required.
              </div>
              <div>
                <span className="font-semibold text-white">Legitimate Interests:</span> Processing
                information for legitimate operational purposes, where permitted by law and balanced
                against your rights.
              </div>
            </div>
          </section>

          {/* 5. Location Data */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">5. Location Data</h2>
            <p className="mb-2">
              Location information is important to Rydra&apos;s ride-hailing and delivery services.
              Depending on your permissions and the features you use, location data may help us:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Identify your pickup location.</li>
              <li>Connect you with nearby drivers.</li>
              <li>Estimate routes and fares.</li>
              <li>Track active rides and deliveries.</li>
              <li>Support trip-sharing and safety features.</li>
            </ul>
            <p>
              You can manage location permissions through your device settings. Where supported, you
              may enter your pickup or destination address manually.
            </p>
          </section>

          {/* 6. Sharing Your Information */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">6. Sharing Your Information</h2>
            <p className="mb-3">
              We may share information with authorized parties where necessary to provide our services.
              These may include:
            </p>
            <div className="space-y-2 mb-3">
              <div>
                <span className="font-semibold text-white">Drivers and Delivery Partners:</span> Relevant
                booking details, such as pickup locations, destinations, and contact information needed
                to complete a service.
              </div>
              <div>
                <span className="font-semibold text-white">Payment Service Providers:</span> Information
                necessary to process transactions and refunds.
              </div>
              <div>
                <span className="font-semibold text-white">Technology Service Providers:</span> Authorized
                providers that support hosting, communication, mapping, security, or other operational
                functions.
              </div>
              <div>
                <span className="font-semibold text-white">Legal and Regulatory Authorities:</span> Information
                required by applicable law or a valid legal process.
              </div>
            </div>
            <p className="font-semibold text-white">We do not sell personal information to third parties.</p>
          </section>

          {/* 7. Data Security */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">7. Data Security</h2>
            <p className="mb-2">
              We take reasonable technical and organizational measures to protect personal information
              against unauthorized access, misuse, alteration, and disclosure.
            </p>
            <p className="mb-2">However, no digital system can guarantee absolute security.</p>
            <p>
              We encourage users to protect their accounts and report suspicious activity promptly.
            </p>
          </section>

          {/* 8. Data Retention */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">8. Data Retention</h2>
            <p className="mb-2">
              We retain personal information only for as long as reasonably necessary for the purposes
              described in this policy or as required by applicable law.
            </p>
            <p>
              Retention periods may vary depending on the information involved, contractual
              requirements, financial recordkeeping obligations, and unresolved disputes.
            </p>
          </section>

          {/* 9. Your Privacy Rights */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">9. Your Privacy Rights</h2>
            <p className="mb-2">Subject to applicable law, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Request access to your personal information.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of eligible personal information.</li>
              <li>Withdraw consent where processing relies on consent.</li>
              <li>Object to certain processing activities.</li>
              <li>Request portability of eligible information.</li>
              <li>Lodge a complaint with the relevant data protection authority.</li>
            </ul>
            <p>You can contact Rydra Support to exercise applicable rights.</p>
          </section>

          {/* 10. Account Deletion */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">10. Account Deletion</h2>
            <p className="mb-2">
              You may request deletion of your Rydra account through the Privacy &amp; Data section of
              the application.
            </p>
            <p className="mb-2">
              Once your request is verified, we will process it in accordance with our deletion
              procedures and applicable law.
            </p>
            <p className="mb-2">
              Account deletion may result in the removal of your profile, saved addresses, and other
              associated information.
            </p>
            <p>
              Some records may be retained where required by law or necessary to resolve legitimate
              outstanding matters.
            </p>
          </section>

          {/* 11. Marketing Communications */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">11. Marketing Communications</h2>
            <p className="mb-2">
              Rydra may send information about promotions, offers, new features, and service updates
              where permitted.
            </p>
            <p className="mb-2">
              You can manage optional promotional notifications through your notification preferences.
            </p>
            <p>
              Essential communications relating to your account, bookings, payments, or security may
              still be sent when necessary.
            </p>
          </section>

          {/* 12. Children's Privacy */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">12. Children&apos;s Privacy</h2>
            <p className="mb-2">Rydra&apos;s services are subject to applicable age requirements.</p>
            <p>
              Where personal information relating to a child is processed, Rydra will comply with
              relevant legal requirements, including any necessary parental or guardian
              authorization.
            </p>
          </section>

          {/* 13. International Data Transfers */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              13. International Data Transfers
            </h2>
            <p className="mb-2">
              Where Rydra uses service providers located outside Nigeria, personal information may be
              transferred internationally.
            </p>
            <p>
              Any such transfers will be handled in accordance with applicable data protection
              requirements.
            </p>
          </section>

          {/* 14. Changes to This Policy */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">14. Changes to This Policy</h2>
            <p className="mb-2">
              We may update this Privacy Policy to reflect changes in our services, technology, or
              legal obligations.
            </p>
            <p>Material changes will be communicated through appropriate channels.</p>
          </section>

          {/* 15. Contact Us */}
          <section className="border-t border-slate-800 pt-6">
            <h2 className="text-base font-bold text-white mb-2">15. Contact Us</h2>
            <p className="mb-2">
              For privacy-related questions, requests, or complaints, please contact:
            </p>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="font-bold text-white">Rydra Integrated Technologies Limited</p>
              <p className="text-emerald-400">
                Email:{' '}
                <a
                  href="mailto:rydraintegratedtechnologies@gmail.com"
                  className="underline hover:text-emerald-300"
                >
                  rydraintegratedtechnologies@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

