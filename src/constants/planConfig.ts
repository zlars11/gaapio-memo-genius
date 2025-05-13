
export const PLANS = [
  {
    id: "emerging",
    label: "Emerging",
    price: 400,
    annualAmount: 4800,
    users: 3,
    description: "Up to 3 users",
    display: "$400/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "mid",
    label: "Mid-Market",
    price: 700,
    annualAmount: 8400,
    users: 6,
    description: "Up to 6 users",
    display: "$700/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: 1000,
    annualAmount: 12000,
    users: "Unlimited",
    description: "Unlimited users",
    display: "$1,000/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "firms",
    label: "Firms",
    price: null,
    annualAmount: null,
    users: null,
    description: "Contact Sales",
    display: "Contact Sales"
  },
];

export const PLAN_FEATURES = [
  "Version history",
  "Internal workflows",
  "Audit package (Mid-Market and Enterprise)",
  "Compliance updates and training (Enterprise only)",
];

export const getPlanObject = (planId: string) => {
  return PLANS.find(p => p.id === planId) || PLANS[0];
};

export const getPlanLabel = (planId: string) => {
  const plan = getPlanObject(planId);
  return plan ? plan.display : "Contact Sales";
};
