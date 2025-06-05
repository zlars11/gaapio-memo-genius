
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, ArrowRight } from "lucide-react";

export function FinalCtaBanner() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Know the Standards. Apply Them Confidently.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Join firms who trust Gaapio to deliver compliance updates that make sense.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="blue" asChild>
              <Link to="/request-demo">
                <Download className="w-5 h-5 mr-2" />
                Start Getting Alerts
              </Link>
            </Button>
            <Button size="lg" variant="blueOutline" asChild>
              <Link to="/contact">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
