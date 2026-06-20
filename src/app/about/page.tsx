import { ArrowUpRight, Code2, Users, Rocket, Terminal, Database, Palette, Shield, BrainCircuit, Box, Workflow, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 flex-1 space-y-16">
      
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="space-y-4 flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Uday Sharma
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Tech Creator, Developer & Founder of HackShastra
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I build elegant tools that solve real problems. Passionate about software engineering, community building, and creating educational content that empowers the next generation of developers in India and beyond.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
              <GithubIcon className="w-4 h-4" /> GitHub
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
              <TwitterIcon className="w-4 h-4" /> Twitter
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
              <LinkedinIcon className="w-4 h-4" /> LinkedIn
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
              <InstagramIcon className="w-4 h-4" /> Instagram
            </a>
          </div>
        </div>
        
        <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-xl ring-1 ring-border/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/40 z-10 mix-blend-overlay"></div>
          {/* Placeholder for Uday's profile picture */}
          <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground/50">
            US
          </div>
        </div>
      </div>

      {/* Creator Journey */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">The Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm space-y-3 transition-colors hover:bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Engineering</h3>
            <p className="text-sm text-muted-foreground">Full-stack development specializing in modern web technologies, scalable architectures, and beautiful UIs.</p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm space-y-3 transition-colors hover:bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">HackShastra</h3>
            <p className="text-sm text-muted-foreground">Founder of HackShastra, a community-driven initiative dedicated to teaching and building open-source tech.</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm space-y-3 transition-colors hover:bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Community</h3>
            <p className="text-sm text-muted-foreground">Growing a strong community of tech enthusiasts through high-quality video content and educational resources.</p>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm text-center space-y-2 hover:bg-muted/30 transition-colors">
          <h4 className="text-3xl font-bold text-foreground">500k+</h4>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Community</p>
        </Card>
        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm text-center space-y-2 hover:bg-muted/30 transition-colors">
          <h4 className="text-3xl font-bold text-foreground">35x</h4>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hackathon Judge</p>
        </Card>
        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm text-center space-y-2 hover:bg-muted/30 transition-colors">
          <h4 className="text-3xl font-bold text-foreground">28x</h4>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Guest Speaker</p>
        </Card>
        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm text-center space-y-2 hover:bg-muted/30 transition-colors">
          <h4 className="text-3xl font-bold text-foreground">2+</h4>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Founding Roles</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Tech Creator & Dev</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            I build robust applications like this downloader and create content to educate over half a million developers worldwide. My goal is to make tech accessible and build tools that solve real problems.
          </p>
        </Card>
        
        <Card className="p-8 border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Community Leader</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            As the Co-Founder of HackShastra and Founder of Devndez, I actively foster developer communities. I've judged 35 hackathons and spoken at 28 events, guiding the next generation of engineers.
          </p>
        </Card>
      </div>

      {/* Tech Stack */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:bg-muted/50 transition-colors flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">TypeScript</span>
          </Card>
          <Card className="p-4 border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:bg-muted/50 transition-colors flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-zinc-500/10 flex items-center justify-center text-foreground">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Next.js 15</span>
          </Card>
          <Card className="p-4 border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:bg-muted/50 transition-colors flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Palette className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Tailwind CSS</span>
          </Card>
          <Card className="p-4 border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:bg-muted/50 transition-colors flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center text-green-500">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Node.js</span>
          </Card>
        </div>
      </div>

      {/* GitHub/Open Source */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Open Source</h2>
        <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-primary/50 w-full" />
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GithubIcon className="w-5 h-5" /> Open Source Contributor
              </h3>
              <p className="text-muted-foreground text-sm">
                I believe in building in public and sharing code with the community. Check out my repositories, stars, and contributions.
              </p>
            </div>
            <a href="https://github.com/udaysharmadev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 shrink-0 group">
              View GitHub Profile <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Card>
      </div>

    </div>
  );
}
