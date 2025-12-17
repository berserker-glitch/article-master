import { LegalPage } from "@/components/legal/legal-page"

const content = `Last updated: 12/17/2025
Refund Policy

At Scolink, we want you to be satisfied with ArticleAlchemist. This Refund Policy outlines our refund process and eligibility criteria. All payments are processed by Paddle.com Market Limited ("Paddle"), and refunds are handled through their system in accordance with their policies and applicable consumer protection laws.
14-Day Refund Guarantee

If you are not satisfied with ArticleAlchemist, you can request a full refund within 14 days of your initial purchase. This applies to all subscription plans (Pro and Premium). To be eligible for a refund, you must contact us within this 14-day period.
How to Request a Refund

    Contact Paddle support through your account dashboard or receipt
    Include your account email and reason for the refund request
    Requests must be made within 14 days of purchase
    Paddle will process eligible refunds according to their refund policy

Refund Eligibility

Refunds are available for the following reasons:

    Technical issues preventing normal use of the Service
    Service not meeting advertised functionality
    Dissatisfaction with the Service within the 14-day period

Refunds are not available for:

    Requests made after the 14-day period has expired
    Change of mind after the refund window has closed
    Violation of our Terms of Service
    Requests for partial refunds or prorated amounts

Subscription Cancellation

You can cancel your subscription at any time through your Paddle account. Cancellation will take effect at the end of your current billing period, and you will retain access to paid features until that date. Cancellations do not automatically trigger refunds for unused portions of the billing period.
Processing Time

Approved refunds are typically processed within 3-5 business days through Paddle's system. The time for the refund to appear in your original payment method may vary depending on your bank or payment provider.
Contact Information

For refund requests or questions about this policy, please contact Paddle support using the information provided in your purchase confirmation email or through your Paddle account dashboard. For general Service questions, please visit our contact page.
Changes to This Policy

We may update this Refund Policy from time to time. If we make material changes, we will provide reasonable notice (for example, via the app or email). Your continued use of the Service after the effective date of the updated Refund Policy constitutes acceptance of the changes.`

export default function RefundPolicyPage() {
  return <LegalPage title="Refund Policy" content={content} />
}

