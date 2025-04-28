
export const PLANS = [
  {
    id: "emerging",
    label: "Emerging",
    price: 200,
    annualAmount: 2400,
    users: 3,
    description: "Up to 3 users",
    display: "$200/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "mid",
    label: "Mid-Market",
    price: 300,
    annualAmount: 3600,
    users: 6,
    description: "Up to 6 users",
    display: "$300/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: 500,
    annualAmount: 6000,
    users: "Unlimited",
    description: "Unlimited users",
    display: "$500/month <span class='text-sm font-normal'>(Paid Annually)</span>"
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
  "Unlimited AI-generated memos",
  "Free premium templates",
  "Team collaboration tools",
];

export const getPlanObject = (planId: string) => {
  return PLANS.find(p => p.id === planId) || PLANS[0];
};

export const getPlanLabel = (planId: string) => {
  const plan = getPlanObject(planId);
  return plan ? plan.display : "Contact Sales";
};
