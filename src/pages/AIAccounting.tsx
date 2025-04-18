
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, ArrowLeft, Bot, Zap, MicrochipIcon, Settings2, LineChart, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIAccounting() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28">
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b">
          <ResponsiveContainer className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105 duration-300">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                How AI Is Changing the Accounting Landscape
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>By Zack Larsen, CPA</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <time>March 28, 2025</time>
                </div>
                <span>•</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">
                  Technology
                </Badge>
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer className="py-12 md:py-16">
          <article className="prose prose-gray dark:prose-invert mx-auto max-w-4xl">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              The accounting profession is undergoing a radical transformation—and at the center of this change is artificial intelligence (AI). What once required hours of manual spreadsheet work, reconciliations, and reviews can now be performed in seconds by intelligent systems trained to mimic the judgment and precision of a seasoned accountant.
            </p>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              But this isn't just about efficiency. AI is reshaping what it means to be an accountant. The profession is evolving from transactional to strategic—opening the door to new roles, responsibilities, and opportunities for those ready to adapt.
            </p>

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              The AI Revolution in Accounting: More Than Automation
            </h2>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              For many, AI in accounting conjures images of automated data entry and robotic process automation. While those are important use cases, the real power of AI lies in its ability to think—at least, to learn from data and make intelligent recommendations.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-4">Let's look at some of the most impactful shifts:</h3>

            <div className="grid gap-8 my-8">
              <div>
                <h3 className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  1. Automated Data Processing—At Scale
                </h3>
                <p>
                  AI systems can process and categorize thousands of transactions per second, flagging exceptions and anomalies in real time. This eliminates the bottlenecks caused by human data entry and significantly reduces errors. Whether it's invoice processing, expense categorization, or month-end journal entries, the manual work is quickly being replaced by always-on digital assistants.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  2. From Historical to Predictive Analysis
                </h3>
                <p>
                  Machine learning algorithms don't just crunch numbers—they learn from them. By analyzing historical patterns, AI can predict future outcomes like cash flow shortages, revenue trends, or even customer churn. This turns accounting from a retrospective function into a forward-looking powerhouse of strategic insights.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  3. Workflow Optimization Through Continuous Learning
                </h3>
                <p>
                  AI doesn't fatigue, and it doesn't stop improving. As these systems are exposed to more transactions, feedback, and edge cases, they learn—becoming more accurate and efficient over time. That means your accounting processes are not just faster, but smarter with every cycle.
                </p>
              </div>
            </div>

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <Users className="h-6 w-6 text-primary" />
              Redefining the Role of the Accountant
            </h2>
            
            <p className="text-lg leading-relaxed">
              Perhaps the most profound impact of AI is on the accounting professional themself. As automation handles more of the grunt work, accountants are increasingly stepping into roles that require critical thinking, interpretation, and communication.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-4">Here's what that shift looks like in practice:</h3>

            <ul className="space-y-3 my-6">
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>From Data Entry to Decision Support: Instead of inputting data, accountants now spend their time interpreting AI-generated reports and advising on business strategy.</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>New Skill Sets: The modern accountant must be fluent not just in GAAP and Excel, but also in data visualization tools, cloud platforms, and AI technologies.</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Elevated Value: With compliance and reporting on autopilot, accounting teams can focus on areas that drive real value—like forecasting, risk assessment, and scenario planning.</span>
              </li>
            </ul>

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
              What This Means for Firms and Finance Leaders
            </h2>
            
            <p className="text-lg leading-relaxed mb-6">
              AI isn't a threat to the accounting profession—it's an amplifier. Firms that embrace these tools are able to deliver more insight with fewer resources, scale their services, and provide deeper strategic support to clients and stakeholders.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              For controllers, CFOs, and partners, the takeaway is clear: the future of accounting is not just faster or cheaper—it's smarter. Those who invest in the right tools and training today will be tomorrow's leaders in financial transformation.
            </p>

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              Final Thoughts
            </h2>
            
            <p className="text-lg leading-relaxed mb-6">
              We're at a pivotal moment in the evolution of accounting. AI is not replacing accountants—it's redefining them. It's freeing professionals from the monotony of manual tasks and empowering them to deliver more strategic, forward-looking, and impactful contributions to their organizations.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              The firms and individuals who recognize this shift and adapt early will not only survive the AI revolution—they'll lead it.
            </p>

            <div className="mt-16 flex justify-center">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </article>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
