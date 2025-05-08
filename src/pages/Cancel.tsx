
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer>
          <div className="max-w-lg mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <XCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Checkout Canceled</CardTitle>
                <CardDescription>
                  Your subscription was not completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  You have canceled the checkout process. If you have any questions or need assistance, please don't hesitate to contact our support team.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild>
                  <Link to="/pricing">Try Again</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
