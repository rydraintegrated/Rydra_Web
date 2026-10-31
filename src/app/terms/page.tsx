import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Rydra Integrated Technologies Limited',
  description: 'Official Terms & Conditions governing the use of Rydra mobility and delivery platform.',
};

export default function TermsPage() {
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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              RYDRA INTEGRATED TECHNOLOGIES LIMITED
            </h1>
            <p className="text-sm font-semibold text-emerald-400">Terms & Conditions</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-8 border-b border-slate-800 pb-4">
          Last Updated on 24 October, 2026
        </p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Introduction</h2>
            <p className="mb-2">Welcome to Rydra!</p>
            <p className="mb-2">
              These Terms & Conditions govern your access to and use of the Rydra mobile application
              and related services provided by Rydra Integrated Technologies Limited (&quot;Rydra,&quot;
              &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
            </p>
            <p className="mb-2">
              Rydra is a technology platform designed to connect customers with transportation and
              courier delivery services.
            </p>
            <p>
              By creating an account or using our services, you agree to these Terms & Conditions and
              our Privacy Policy. Please read them carefully before using Rydra.
            </p>
          </section>

          {/* 2. Eligibility and Account Registration */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              2. Eligibility and Account Registration
            </h2>
            <p className="mb-2">
              To use Rydra, you must meet the applicable legal age requirements or have any consent
              required by law.
            </p>
            <p className="mb-2">When creating an account, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Provide accurate and up-to-date information.</li>
              <li>Maintain the confidentiality of your account.</li>
              <li>Keep your contact information updated.</li>
              <li>Notify Rydra immediately if you suspect unauthorized access.</li>
            </ul>
            <p>
              You are responsible for activities carried out through your account, except where
              applicable law provides otherwise.
            </p>
          </section>

          {/* 3. Our Services */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Our Services</h2>
            <p className="mb-3">Rydra provides access to the following services:</p>
            <div className="space-y-2 mb-3">
              <div>
                <span className="font-semibold text-white">Ride Booking:</span> Customers can request
                transportation services, view estimated fares, connect with available drivers, and
                track their rides.
              </div>
              <div>
                <span className="font-semibold text-white">Courier & Delivery:</span> Customers can
                request the pickup and delivery of permitted packages through available delivery
                partners.
              </div>
            </div>
            <p>
              Service availability may vary depending on your location, driver availability,
              operating hours, and other relevant factors.
            </p>
          </section>

          {/* 4. Ride Booking and Responsibilities */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              4. Ride Booking and Responsibilities
            </h2>
            <p className="mb-2">When booking a ride, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Provide accurate pickup and destination details.</li>
              <li>Be available at the agreed pickup location.</li>
              <li>Treat drivers and their vehicles respectfully.</li>
              <li>Follow reasonable safety instructions.</li>
              <li>Avoid activities that could endanger yourself, the driver, or others.</li>
            </ul>
            <p className="mb-2">
              Drivers are expected to maintain appropriate professional standards and comply with
              applicable transportation and safety requirements.
            </p>
            <p>
              Rydra may take appropriate action where users or service providers violate platform
              rules.
            </p>
          </section>

          {/* 5. Courier and Delivery Services */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              5. Courier and Delivery Services
            </h2>
            <p className="mb-2">
              When requesting a delivery, you agree to provide accurate pickup and delivery
              information.
            </p>
            <p className="mb-2">
              Packages must be properly prepared and suitable for transportation.
            </p>
            <p className="mb-2">
              Rydra prohibits deliveries involving illegal, hazardous, or otherwise restricted items.
            </p>
            <p className="mb-2">
              Customers must provide accurate information about package contents where required.
            </p>
            <p>
              Delivery availability, applicable restrictions, package limits, and handling
              requirements will be communicated through the platform or relevant policies.
            </p>
          </section>

          {/* 6. Fares and Payments */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">6. Fares and Payments</h2>
            <p className="mb-2">
              Rydra displays applicable fare information before a booking is confirmed.
            </p>
            <p className="mb-2">
              Final charges may depend on factors such as distance, travel conditions, waiting time,
              additional services, or approved fare adjustments.
            </p>
            <p className="mb-2">
              Where a fare may change after confirmation, Rydra will explain the applicable
              circumstances.
            </p>
            <p className="mb-2">
              Customers agree to pay all legitimate charges associated with completed services.
            </p>
            <p>
              Payments are processed through Rydra&apos;s supported payment methods and authorized payment
              service providers.
            </p>
          </section>

          {/* 7. Cancellations and Refunds */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">7. Cancellations and Refunds</h2>
            <p className="mb-2">
              Customers may cancel rides or deliveries in accordance with Rydra&apos;s Cancellation &amp;
              Refund Policy.
            </p>
            <p className="mb-2">Depending on the circumstances, cancellation charges may apply.</p>
            <p className="mb-2">
              Refund eligibility depends on the service status, payment records, and circumstances
              surrounding the cancellation or complaint.
            </p>
            <p>For additional information, please refer to our Cancellation &amp; Refund Policy.</p>
          </section>

          {/* 8. Safety and Security */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">8. Safety and Security</h2>
            <p className="mb-2">Your safety matters to us.</p>
            <p className="mb-2">
              Rydra may provide safety features such as driver verification, ride confirmation codes,
              live tracking, and trip sharing.
            </p>
            <p className="mb-2">Customers are encouraged to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Confirm driver and vehicle details before starting a ride.</li>
              <li>Use available ride verification features.</li>
              <li>Report suspicious or inappropriate behaviour.</li>
              <li>Follow appropriate safety precautions.</li>
            </ul>
            <p>
              Rydra&apos;s safety features support safer journeys but do not guarantee that every risk
              can be eliminated.
            </p>
          </section>

          {/* 9. Acceptable Use */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">9. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Use Rydra for unlawful activities.</li>
              <li>Provide false or misleading information.</li>
              <li>Harass, threaten, or discriminate against other users.</li>
              <li>Attempt to manipulate fares, payments, or bookings.</li>
              <li>Interfere with the platform&apos;s security or functionality.</li>
              <li>Use another person&apos;s account without authorization.</li>
            </ul>
            <p>
              Violations may result in appropriate restrictions, suspension, or termination,
              subject to applicable law.
            </p>
          </section>

          {/* 10. Account Suspension and Termination */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              10. Account Suspension and Termination
            </h2>
            <p className="mb-2">
              Rydra may restrict or suspend accounts where reasonably necessary to address fraud,
              security concerns, serious policy violations, or legal requirements.
            </p>
            <p className="mb-2">
              Where appropriate, affected users will be informed of the reason and available
              resolution procedures.
            </p>
            <p className="mb-2">
              Users may request account deletion through the Privacy &amp; Data section of the
              application.
            </p>
            <p>
              Certain information may be retained where necessary to meet legal obligations or resolve
              outstanding matters.
            </p>
          </section>

          {/* 11. Service Availability */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">11. Service Availability</h2>
            <p className="mb-2">We aim to provide reliable access to Rydra.</p>
            <p className="mb-2">
              However, services may occasionally be affected by maintenance, technical difficulties,
              network disruptions, or circumstances outside our reasonable control.
            </p>
            <p>Rydra does not guarantee uninterrupted service availability.</p>
          </section>

          {/* 12. Complaints and Dispute Resolution */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              12. Complaints and Dispute Resolution
            </h2>
            <p className="mb-2">
              If you experience a problem with a ride, delivery, payment, or another service, you can
              contact Rydra Support.
            </p>
            <p className="mb-2">We will review complaints and work toward a fair resolution.</p>
            <p>
              Nothing in these Terms removes rights or remedies available to customers under
              applicable Nigerian law.
            </p>
          </section>

          {/* 13. Limitation of Liability */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">13. Limitation of Liability</h2>
            <p className="mb-2">
              Rydra&apos;s responsibilities and liabilities depend on its role in providing or
              arranging services and the circumstances of each incident.
            </p>
            <p className="mb-2">
              To the extent permitted by applicable law, Rydra is not responsible for losses caused
              solely by circumstances beyond its reasonable control.
            </p>
            <p>
              Nothing in these Terms excludes liability that cannot lawfully be excluded, including
              applicable liability arising from negligence, misconduct, or violations of consumer
              rights.
            </p>
          </section>

          {/* 14. Changes to These Terms */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">14. Changes to These Terms</h2>
            <p className="mb-2">
              Rydra may update these Terms &amp; Conditions to reflect changes in our services,
              operations, or legal obligations.
            </p>
            <p>Where changes materially affect users, we will provide appropriate notice.</p>
          </section>

          {/* 15. Governing Law */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">15. Governing Law</h2>
            <p>
              These Terms &amp; Conditions are governed by the applicable laws of the Federal Republic
              of Nigeria.
            </p>
          </section>

          {/* 16. Contact Us */}
          <section className="border-t border-slate-800 pt-6">
            <h2 className="text-base font-bold text-white mb-2">16. Contact Us</h2>
            <p className="mb-2">
              For questions, complaints, or assistance regarding these Terms &amp; Conditions, please
              contact:
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

