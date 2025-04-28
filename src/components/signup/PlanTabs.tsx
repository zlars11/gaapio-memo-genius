
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANS } from "@/constants/planConfig";

interface PlanTabsProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
}

export const PlanTabs = ({ selectedPlan, onPlanChange }: PlanTabsProps) => {
  return (
    <Tabs defaultValue={selectedPlan} value={selectedPlan} onValueChange={onPlanChange}>
      <TabsList className="w-full mb-4 gap-0 overflow-hidden flex justify-between glass-morphism">
        {PLANS.map(plan => (
          <TabsTrigger
            key={plan.id}
            value={plan.id}
            className={`
              w-1/4 px-0 py-3 text-base rounded-none border-0
              font-medium tracking-tight transition-colors
              border-r border-muted last:border-r-0
              data-[state=active]:font-semibold
            `}
            style={{
              minWidth: 0,
              minHeight: 0,
            }}
            data-testid={`plan-tab-${plan.id}`}
          >
            {plan.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
