import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, Zap, Globe, Github, Twitter, Linkedin, BarChart, Server, Headphones, Code, Database, Cloud, Lock, Terminal, Layers, Palette, FileCode, Cpu } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-gray-900 py-20">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    {/* Floating Shapes */}
                    <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="container relative z-10 px-4 md:px-6 text-center">

                    {/* HEADLINE */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm">
                            Revolutionizing <br className="hidden md:block" /> Project Management
                        </span>
                    </h1>

                    {/* SUBHEADING */}
                    <p className="mx-auto max-w-3xl text-lg md:text-xl text-gray-300/90 mb-10 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Empower Teams <span className="text-gray-500 mx-2">|</span> Streamline Workflows <span className="text-gray-500 mx-2">|</span> Drive Success with Intelligent Task Management
                    </p>

                    {/* CTA BUTTONS */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <Link href="/register">
                            <Button className="px-8 py-7 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:scale-105 hover:shadow-purple-500/40 transition-all duration-300 text-lg">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/projects">
                            <Button variant="outline" className="px-8 py-7 rounded-lg bg-transparent border-2 border-purple-600 text-violet-400 font-semibold hover:bg-purple-600/10 transition-all duration-300 text-lg">
                                View Projects
                            </Button>
                        </Link>
                    </div>

                    {/* TRUST BADGES */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium animate-in fade-in zoom-in-50 duration-1000 delay-300">
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-blue-500/10">
                                <Shield className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            Trusted by 10K+ Teams
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-yellow-500/10">
                                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                            </div>
                            99.9% Uptime
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-purple-500/10">
                                <Users className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            50K+ Projects
                        </div>
                    </div>

                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="container px-10 max-w-[1200px] mx-auto">

                    {/* SECTION TITLE & MISSION TEXT */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Our Mission</h2>
                        <p className="mx-auto max-w-[600px] text-lg text-gray-300 leading-relaxed">
                            To revolutionize project management by providing teams with intuitive, powerful tools that transform how they collaborate, communicate, and deliver results.
                        </p>
                    </div>

                    {/* VALUES CARDS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: "Security First",
                                desc: "Enterprise-grade protection for your sensitive project data.",
                                gradient: "from-blue-400 to-blue-600"
                            },
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                desc: "Optimized performance ensures your workflow never hits a bottleneck.",
                                gradient: "from-purple-400 to-purple-600"
                            },
                            {
                                icon: Users,
                                title: "Collaboration",
                                desc: "Seamless teamwork features that bridge the gap between planning and execution.",
                                gradient: "from-cyan-400 to-cyan-600"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 px-6 rounded-xl border border-purple-400/20 bg-slate-800/80 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/10">
                                <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} opacity-90 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-20 bg-[#0F172A] border-t border-slate-800">
                <div className="container px-10 max-w-[1200px] mx-auto">

                    {/* SECTION TITLE */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Our Impact</h2>
                    </div>

                    {/* METRICS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                label: "Active Users",
                                value: "10K+",
                                desc: "Trusted by developers worldwide"
                            },
                            {
                                label: "Projects Created",
                                value: "50K+",
                                desc: "Empowering ideas to reality"
                            },
                            {
                                label: "Tasks Completed",
                                value: "1M+",
                                desc: "Moving work forward every day"
                            },
                            {
                                label: "Uptime",
                                value: "99.9%",
                                desc: "Reliability you can count on"
                            }
                        ].map((stat, i) => (
                            <div key={i} className="group p-8 text-center rounded-xl border border-purple-400/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
                                <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-3">{stat.value}</h3>
                                <p className="text-gray-300 font-medium text-lg mb-2">{stat.label}</p>
                                <p className="text-gray-500 text-xs">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-[#0F172A] border-t border-slate-800">
                <div className="container px-10 max-w-[1400px] mx-auto">

                    {/* SECTION TITLE & SUBTITLE */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Why Choose Project Manager?</h2>
                        <p className="text-lg text-gray-400">Everything you need to manage projects successfully</p>
                    </div>

                    {/* FEATURES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Globe,
                                title: "Intuitive Interface",
                                desc: "Designed for clarity and ease of use, so you can focus on work, not learning tools.",
                                color: "text-blue-500",
                                border: "border-l-blue-500"
                            },
                            {
                                icon: Users,
                                title: "Real-time Collaboration",
                                desc: "Work together seamlessly with your team, no matter where they are in the world.",
                                color: "text-purple-500",
                                border: "border-l-purple-500"
                            },
                            {
                                icon: BarChart,
                                title: "Advanced Analytics",
                                desc: "Gain deep insights into project performance with powerful, customizable reports.",
                                color: "text-cyan-500",
                                border: "border-l-cyan-500"
                            },
                            {
                                icon: Shield,
                                title: "Enterprise Security",
                                desc: "Bank-grade encryption and strict access controls keep your data safe and compliant.",
                                color: "text-pink-500",
                                border: "border-l-pink-500"
                            },
                            {
                                icon: Server,
                                title: "Scalable Solution",
                                desc: "From small startups to large enterprises, our platform grows with your needs.",
                                color: "text-green-500",
                                border: "border-l-green-500"
                            },
                            {
                                icon: Headphones,
                                title: "24/7 Support",
                                desc: "Our dedicated support team is always available to help you resolve any issues.",
                                color: "text-orange-500",
                                border: "border-l-orange-500"
                            }
                        ].map((feature, i) => (
                            <div key={i} className={`group p-8 rounded-lg bg-slate-800/60 border border-purple-400/10 ${feature.border} border-l-4 backdrop-blur-md transition-all duration-300 hover:bg-slate-800 hover:-translate-y-2 hover:shadow-xl`}>
                                <div className={`mb-4 ${feature.color} group-hover:animate-bounce`}>
                                    <feature.icon className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.desc}</p>
                                <a href="#" className="inline-flex items-center text-xs font-medium text-violet-400 opacity-80 group-hover:opacity-100 transition-opacity hover:underline">
                                    Learn more <span className="ml-1">→</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-[#0F172A] border-t border-slate-800">
                <div className="container px-10 max-w-[1400px] mx-auto">

                    {/* SECTION TITLE & SUBTITLE */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Meet the Creator</h2>
                        <p className="text-lg text-gray-400">Built by a developer, for developers</p>
                    </div>

                    {/* TEAM GRID */}
                    <div className="flex justify-center">
                        {[
                            {
                                name: "Prem Shah",
                                role: "Founder & Lead Developer",
                                bio: "Passionate full-stack developer with a vision to simplify project management.",
                                tags: ["Next.js", "TypeScript", "Node.js"],
                                gradient: "from-blue-600 to-purple-600",
                                initials: "PS",
                                links: {
                                    twitter: "#",
                                    github: "https://github.com/premshah7",
                                    linkedin: "https://www.linkedin.com/in/prem-shah-980552201/"
                                }
                            }
                        ].map((member, i) => (
                            <div key={i} className="group p-8 rounded-xl bg-slate-800/70 border border-purple-400/20 backdrop-blur-md transition-all duration-400 hover:bg-slate-800 hover:border-purple-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 text-center w-full max-w-md">

                                {/* AVATAR */}
                                <div className={`relative mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br ${member.gradient} p-[3px] group-hover:shadow-lg transition-all duration-300`}>
                                    <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-white/20 transition-all">
                                        <span className="text-4xl font-bold text-white/90">{member.initials}</span>
                                    </div>
                                </div>

                                {/* INFO */}
                                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                                <p className="text-base font-medium text-violet-400 mb-4">{member.role}</p>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.bio}</p>

                                {/* TAGS */}
                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {member.tags.map((tag, t) => (
                                        <span key={t} className="px-3 py-1 text-xs rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* SOCIALS */}
                                <div className="flex justify-center gap-4">
                                    <Link href={member.links.github} className="text-gray-400 hover:text-violet-400 transition-colors">
                                        <Github className="w-5 h-5" />
                                    </Link>
                                    <Link href={member.links.twitter} className="text-gray-400 hover:text-violet-400 transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </Link>
                                    <Link href={member.links.linkedin} className="text-gray-400 hover:text-violet-400 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Timeline Section */}
            <section className="py-24 bg-[#0F172A] border-t border-slate-800">
                <div className="container px-10 max-w-[1200px] mx-auto">

                    {/* SECTION TITLE */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Our Journey</h2>
                        <p className="text-lg text-gray-400">From a simple idea to a platform powering thousands</p>
                    </div>

                    {/* TIMELINE */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30"></div>

                        <div className="space-y-24">
                            {[
                                {
                                    year: "2023",
                                    title: "The Spark",
                                    desc: "It started with a frustration: existing tools were either too simple or too complex. We wanted something in between.",
                                    align: "left",
                                    gradient: "from-blue-500 to-cyan-500"
                                },
                                {
                                    year: "2024",
                                    title: "v1.0 Launch",
                                    desc: "After months of beta testing with select dev teams, we launched publicly. The response was overwhelming.",
                                    align: "right",
                                    gradient: "from-purple-500 to-pink-500"
                                },
                                {
                                    year: "2025",
                                    title: "Rapid Growth",
                                    desc: "We hit 10k users and introduced AI-powered insights, setting a new standard for project intelligence.",
                                    align: "left",
                                    gradient: "from-amber-500 to-orange-500"
                                },
                                {
                                    year: "Future",
                                    title: "Global Scale",
                                    desc: "We're expanding our ecosystem to include seamless integrations with the tools you already love.",
                                    align: "right",
                                    gradient: "from-green-500 to-emerald-500"
                                }
                            ].map((item, i) => (
                                <div key={i} className={`relative flex items-center justify-between ${item.align === 'right' ? 'flex-row-reverse' : ''}`}>

                                    {/* CONTENT CARD */}
                                    <div className="w-5/12 group">
                                        <div className="p-8 rounded-xl bg-slate-800/40 border border-purple-400/10 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1">
                                            <span className={`inline-block px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-gradient-to-r ${item.gradient} shadow-lg`}>
                                                {item.year}
                                            </span>
                                            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>

                                    {/* CENTER NODE */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center p-1 bg-[#0F172A] rounded-full border border-slate-700">
                                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient} animate-pulse`}></div>
                                    </div>

                                    {/* SPACER FOR OPPOSITE SIDE */}
                                    <div className="w-5/12"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-24 bg-[#0F172A] border-t border-slate-800">
                <div className="container px-10 max-w-[1400px] mx-auto">

                    {/* SECTION TITLE */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Built with Cutting-Edge Technology</h2>
                    </div>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                        {/* FRONTEND COLUMN */}
                        <div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 text-center mb-8">Frontend</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { icon: Globe, name: "Next.js 14", desc: "App Router & Server Components" },
                                    { icon: Code, name: "React 18", desc: "Component-based UI Architecture" },
                                    { icon: FileCode, name: "TypeScript", desc: "Type-safe robust development" },
                                    { icon: Palette, name: "Tailwind CSS", desc: "Utility-first modern styling" }
                                ].map((tech, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-purple-400/10 hover:bg-slate-800/80 hover:border-blue-500/30 transition-all duration-300 group">
                                        <div className="p-2 rounded bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                            <tech.icon className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">{tech.name}</h4>
                                            <p className="text-gray-400 text-xs">{tech.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BACKEND COLUMN */}
                        <div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 text-center mb-8">Backend & Database</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { icon: Server, name: "Node.js", desc: "High-performance JavaScript runtime" },
                                    { icon: Database, name: "Prisma ORM", desc: "Next-generation NodeUI and TypeScript ORM" },
                                    { icon: Server, name: "PostgreSQL", desc: "Advanced open source relational database" },
                                    { icon: Cloud, name: "Vercel", desc: "Edge functions and seamless deployment" }
                                ].map((tech, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-purple-400/10 hover:bg-slate-800/80 hover:border-purple-500/30 transition-all duration-300 group">
                                        <div className="p-2 rounded bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                                            <tech.icon className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">{tech.name}</h4>
                                            <p className="text-gray-400 text-xs">{tech.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TOOLS COLUMN */}
                        <div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600 text-center mb-8">Tools & Features</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { icon: Lock, name: "NextAuth.js", desc: "Secure authentication for Next.js" },
                                    { icon: Layers, name: "Lucide Icons", desc: "Beautiful and consistent iconography" },
                                    { icon: Terminal, name: "Zod", desc: "TypeScript-first schema declaration" },
                                    { icon: Cpu, name: "AI Integration", desc: "Smart project insights and automation" }
                                ].map((tech, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-purple-400/10 hover:bg-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group">
                                        <div className="p-2 rounded bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                                            <tech.icon className="h-6 w-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">{tech.name}</h4>
                                            <p className="text-gray-400 text-xs">{tech.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary/5 border-t border-primary/10">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to streamline your workflow?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of teams using GearGuard to ship faster and safer.</p>
                    <Link href="/register">
                        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">Create Free Account</Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
