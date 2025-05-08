
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export function ClientTypeSelector({ selectedType, onSelectType }: ClientTypeSelectorProps) {
  const clientTypes = [
    {
      id: "company",
      title: "Company",
      description: "I represent a company looking for accounting memo or disclosure solutions",
      icon: Building
    },
    {
      id: "firm",
      title: "CPA Firm",
      description: "I represent an accounting firm looking to use Gaapio for my clients",
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Your Account Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id} 
              className={cn(
                "cursor-pointer transition-all h-full flex flex-col",
                selectedType === type.id 
                  ? "border-primary shadow-md" 
                  : "hover:border-primary/50"
              )}
              onClick={() => onSelectType(type.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    selectedType === type.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{type.description}</p>
              </CardContent>
              
              <CardFooter className="mt-auto">
                <Button 
                  variant={selectedType === type.id ? "default" : "outline"} 
                  className="w-full h-10"
                  onClick={() => onSelectType(type.id)}
                >
                  {selectedType === type.id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
