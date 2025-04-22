
interface Props {
  userInfo: any;
  paymentInfo?: any;
  ANNUAL_LABEL: string;
}

export function SignUpSummary({ userInfo, paymentInfo, ANNUAL_LABEL }: Props) {
  if (!userInfo) return null;
  return (
    <ul className="text-left mx-auto mb-6 max-w-md space-y-2">
      <li><span className="font-medium">First Name:</span> {userInfo.firstName}</li>
      <li><span className="font-medium">Last Name:</span> {userInfo.lastName}</li>
      <li><span className="font-medium">Email:</span> {userInfo.email}</li>
      <li><span className="font-medium">Phone:</span> {userInfo.phone}</li>
      <li><span className="font-medium">Company:</span> {userInfo.company}</li>
      <li><span className="font-medium">Plan:</span> Annual Subscription ({ANNUAL_LABEL})</li>
      {paymentInfo && (
        <>
          <li><span className="font-medium">Card Number:</span> ••••{(paymentInfo.cardNumber || "").slice(-4)}</li>
          <li><span className="font-medium">Expiry:</span> {paymentInfo.cardExpiry}</li>
          <li><span className="font-medium">Billing Zip:</span> {paymentInfo.billingZip}</li>
        </>
      )}
    </ul>
  );
}
