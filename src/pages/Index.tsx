import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Online-Enrollment-App</span>
          </a>
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="outline" size="sm">Docs</Button>
            <Button variant="outline" size="sm">Contact</Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary to-accent opacity-25 blur-3xl motion-safe:animate-float" />
          </div>

          <div className="container py-20 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl sm:text-5xl/tight font-bold tracking-tight">
                Welcome to Online-Enrollment-App
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                A modern, polished Welcome World page to kickstart your online enrollment experience.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="hero" size="xl">
                  Get Started
                  <ArrowRight className="ml-1" />
                </Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 sm:py-16">
          <div className="grid gap-6 sm:grid-cols-3">
            <article className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Fast Setup</h2>
              <p className="mt-2 text-muted-foreground">Get up and running in minutes with a clean, scalable foundation.</p>
            </article>
            <article className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Beautiful UI</h2>
              <p className="mt-2 text-muted-foreground">Premium, responsive components with a vibrant gradient accent.</p>
            </article>
            <article className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Built for Growth</h2>
              <p className="mt-2 text-muted-foreground">Extend easily as your online enrollment needs evolve.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Online-Enrollment-App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
