import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | Rydra Integrated Technologies Limited',
  description: 'Official Cancellation & Refund Policy explaining ride/courier cancellation rules, chargebacks, and refund eligibility for Rydra mobility services.',
};

export default function RefundPolicyPage() {
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
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              RYDRA INTEGRATED TECHNOLOGIES LIMITED
            </h1>
            <p className="text-sm font-semibold text-emerald-400">Cancellation &amp; Refund Policy</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-8 border-b border-slate-800 pb-4">
          Last Updated on 24 October, 2026
        </p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Introduction</h2>
            <p className="mb-2">At Rydra, we understand that plans can change.</p>
            <p className="mb-2">
              This Cancellation &amp; Refund Policy explains how cancellations, charges, and refunds are
              handled when using our ride-hailing and courier delivery services.
            </p>
            <p>
              Our goal is to provide a fair and transparent experience for customers and service
              partners.
            </p>
          </section>

          {/* 2. Ride Cancellations */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Ride Cancellations</h2>
            <p className="mb-2">Customers may cancel a ride through the Rydra application.</p>
            <p className="mb-2">
              Cancellation charges may apply depending on the stage of the booking and the
              circumstances surrounding the cancellation.
            </p>
            <p>
              Where applicable, any cancellation fee will be disclosed before the cancellation is
              confirmed.
            </p>
          </section>

          {/* 3. Cancellation Before Driver Assignment */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              3. Cancellation Before Driver Assignment
            </h2>
            <p>
              If you cancel a ride before a driver has been assigned, no cancellation fee will apply.
            </p>
          </section>

          {/* 4. Cancellation After Driver Assignment */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">
              4. Cancellation After Driver Assignment
            </h2>
            <p className="mb-2">
              A cancellation fee may apply when a customer cancels after a driver has accepted the
              booking.
            </p>
            <p className="mb-2">
              The applicable fee, if any, will depend on Rydra&apos;s published cancellation rules.
            </p>
            <p>Customers will be informed of applicable charges before confirming cancellation.</p>
          </section>

          {/* 5. Driver-Initiated Cancellations */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">5. Driver-Initiated Cancellations</h2>
            <p className="mb-2">
              If a driver cancels a confirmed booking, the customer will not be charged a
              cancellation fee solely because of the driver&apos;s cancellation.
            </p>
            <p>
              Where payment has already been collected for a service that was not provided, the customer
              may be eligible for a refund.
            </p>
          </section>

          {/* 6. Driver Delays and No-Shows */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">6. Driver Delays and No-Shows</h2>
            <p className="mb-2">
              If a driver fails to arrive or arrives significantly later than the estimated pickup time,
              customers may report the issue through Rydra Support.
            </p>
            <p>
              Where the circumstances justify a refund or cancellation-fee reversal, Rydra will review
              the request and apply an appropriate resolution.
            </p>
          </section>

          {/* 7. Courier Delivery Cancellations */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">7. Courier Delivery Cancellations</h2>
            <p className="mb-3">
              Customers may request cancellation of a courier delivery through the Rydra application
              or available support channels. Cancellation eligibility may depend on whether a delivery
              partner has been assigned, whether the package has been collected, and whether
              transportation has started.
            </p>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-white">Before Package Pickup:</span> Customers may
                be eligible for cancellation without additional charges, subject to any clearly
                disclosed applicable fees.
              </div>
              <div>
                <span className="font-semibold text-white">After Package Pickup:</span> Cancellation
                may require additional arrangements for returning or safely handling the package. Any
                applicable return or handling charges will be communicated to the customer.
              </div>
            </div>
          </section>

          {/* 8. Failed or Unsuccessful Deliveries */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">8. Failed or Unsuccessful Deliveries</h2>
            <p className="mb-2">A delivery may be unsuccessful where:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>The recipient is unavailable.</li>
              <li>The delivery address is incorrect or incomplete.</li>
              <li>The package cannot be delivered safely or lawfully.</li>
              <li>Other circumstances prevent successful delivery.</li>
            </ul>
            <p className="mb-2">
              Where possible, Rydra will communicate available options, including another delivery
              attempt or return arrangements.
            </p>
            <p>Any additional charges must follow the applicable disclosed pricing rules.</p>
          </section>

          {/* 9. Refund Eligibility */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">9. Refund Eligibility</h2>
            <p className="mb-3">Customers may be eligible for refunds in circumstances including:</p>
            <div className="space-y-2 mb-3">
              <div>
                <span className="font-semibold text-white">Cancelled Services:</span> A payment was
                collected for a service that was cancelled and is refundable under this policy.
              </div>
              <div>
                <span className="font-semibold text-white">Duplicate Payments:</span> A customer was
                charged more than once for the same transaction.
              </div>
              <div>
                <span className="font-semibold text-white">Incorrect Charges:</span> An error resulted
                in an unauthorized or incorrect charge.
              </div>
              <div>
                <span className="font-semibold text-white">Services Not Provided:</span> A customer
                paid for a ride or delivery that was not provided.
              </div>
              <div>
                <span className="font-semibold text-white">Other Verified Issues:</span> A complaint or
                service failure justifies a refund under applicable law or Rydra&apos;s policies.
              </div>
            </div>
            <p>Refund requests will be reviewed fairly based on the available information.</p>
          </section>

          {/* 10. Non-Refundable Charges */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">10. Non-Refundable Charges</h2>
            <p className="mb-2">
              Certain properly disclosed charges may be non-refundable where permitted by law.
            </p>
            <p className="mb-2">
              These may include applicable cancellation charges or fees for services already provided.
            </p>
            <p>
              Rydra will not apply non-refundable charges in a manner that overrides customers&apos;
              statutory rights.
            </p>
          </section>

          {/* 11. Refund Processing */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">11. Refund Processing</h2>
            <p className="mb-2">
              Approved refunds will be processed through an appropriate payment channel.
            </p>
            <p className="mb-2">
              The time required for funds to become available may depend on the payment method and
              financial institution.
            </p>
            <p>
              Customers will receive an appropriate update regarding the status of their refund
              request.
            </p>
          </section>

          {/* 12. Reporting Payment Issues */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">12. Reporting Payment Issues</h2>
            <p className="mb-2">
              If you experience an incorrect charge, duplicate payment, failed refund, or another
              payment-related issue, please contact Rydra Support. Provide relevant information such
              as:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300">
              <li>Your booking or transaction reference.</li>
              <li>The date of the transaction.</li>
              <li>A description of the issue.</li>
              <li>Supporting evidence, where available.</li>
            </ul>
            <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-3 text-rose-300 text-xs font-semibold">
              Warning: Do not share passwords, verification codes, or sensitive payment credentials
              with support representatives.
            </div>
          </section>

          {/* 13. Refund Disputes */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">13. Refund Disputes</h2>
            <p className="mb-2">
              Where a refund request is declined, customers may contact Rydra Support for
              clarification or further review.
            </p>
            <p>
              Rydra will assess disputes using relevant booking records, transaction information, and
              applicable consumer protection requirements.
            </p>
          </section>

          {/* 14. Changes to This Policy */}
          <section>
            <h2 className="text-base font-bold text-white mb-2">14. Changes to This Policy</h2>
            <p className="mb-2">
              Rydra may update this Cancellation &amp; Refund Policy to reflect changes in our services,
              operations, or legal requirements.
            </p>
            <p>Material changes will be communicated appropriately.</p>
          </section>

          {/* 15. Contact Us */}
          <section className="border-t border-slate-800 pt-6">
            <h2 className="text-base font-bold text-white mb-2">15. Contact Us</h2>
            <p className="mb-2">
              For cancellations, refunds, or payment-related inquiries, please contact:
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

