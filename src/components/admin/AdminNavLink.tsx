
import React from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AdminNavLink() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin" aria-label="Admin Dashboard">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Admin Dashboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
