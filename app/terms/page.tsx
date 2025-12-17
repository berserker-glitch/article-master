import { LegalPage } from "@/components/legal/legal-page"

const content = `Last updated: 12/17/2025
Terms of Service

These Terms of Service ("Terms") govern your access to and use of ArticleAlchemist (the "Service"), operated by Scolink. Scolink is the legal business entity providing this Service. By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
1. Service description

ArticleAlchemist converts YouTube video transcripts into long-form article drafts and stores them in your workspace. The Service is provided on an "as is" and "as available" basis and may change over time as we iterate on the product.
2. Accounts and acceptable use

    You must be at least 18 years old to use the Service.
    You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
    You agree not to misuse the Service, including (without limitation) attempting to break or bypass rate limits, reverse engineer the Service, or use it in violation of applicable law, YouTube's terms, or any third-party rights.
    We may suspend or terminate accounts that abuse free quotas, use the Service for unlawful purposes, or otherwise violate these Terms.

3. Content and intellectual property

    You retain any rights you have to the source content (e.g. your videos and transcripts). You are solely responsible for ensuring that you have the necessary rights to use the source content with the Service.
    Generated drafts are produced based on your input and may contain errors or omissions. You are responsible for reviewing, editing, and using the output in a manner that complies with applicable law and platform policies.
    All Service code, branding, and UI are owned by us or our licensors and may not be copied, modified, or redistributed except as expressly permitted.

4. Plans, billing, and Paddle

The Service offers a free plan and paid subscription plans (such as Pro and Premium). Plan limits, pricing, and features are described on the pricing section of the landing page and may be updated from time to time. Changes to pricing or features will not retroactively apply to completed billing periods.

All payments are processed by Paddle.com Market Limited ("Paddle"). Paddle is the Merchant of Record for all orders, and provides customer service and handles returns for those orders. When you purchase a paid plan, you enter into a billing relationship with Paddle, subject to Paddle's own terms, conditions, and policies. We do not store your full payment card details.

Subscriptions renew automatically at the end of each billing period unless canceled in advance via the Paddle customer portal or any cancellation mechanism provided in the app. Access to paid features may be downgraded or disabled if a renewal payment fails, your subscription is canceled, or your account is otherwise not in good standing.
5. Cancellations and refunds

You can cancel your subscription at any time; cancellation will take effect at the end of the current billing period, and you will retain access to paid features until that date. You can request a refund within 14 days of purchase for any paid subscription. Refunds, if any, are handled in accordance with Paddle's refund policies and applicable consumer protection laws. For billing or refund questions, you may contact Paddle using the information included in your receipt or the Paddle checkout.
6. Data and privacy

We use your account data to operate the Service (for example, to authenticate you, store your generated articles, and enforce plan limits). Billing data is processed by Paddle as Merchant of Record. We may collect usage metrics to improve the Service, but we do not sell your personal data.
7. Disclaimers and limitation of liability

The Service is provided without warranties of any kind, whether express or implied. To the maximum extent permitted by law, we and our suppliers will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits or revenues, arising out of or in connection with your use of the Service.
8. Changes to these Terms

We may update these Terms from time to time. If changes are material, we will provide reasonable notice (for example, via the app or email). Your continued use of the Service after the effective date of the updated Terms constitutes acceptance of the changes.
9. Contact

If you have questions about these Terms or the Service, please visit our contact page or contact Paddle support for billing-related questions.`

export default function TermsPage() {
  return <LegalPage title="Terms of Service" content={content} />
}

