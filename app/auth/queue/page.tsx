"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Clock, CheckCircle2, AlertCircle, RefreshCw, XCircle,
    ShieldCheck, Activity, Users, Zap, HelpCircle, ChevronDown, ChevronUp
} from "lucide-react"

interface QueueStatus {
    queueID: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    userName: string
    email: string
    position: number
    totalQueue: number
    usersAhead: number
    approvalsToday: number
    avgWaitTime: string
    submittedAt: string
    estimatedApprovalTime: string
    approvalPercentage: number
}

export default function QueuePage() {
    const searchParams = useSearchParams()
    const queueID = searchParams.get("queueID")

    const [statusData, setStatusData] = useState<QueueStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [faqOpen, setFaqOpen] = useState<string | null>(null)

    const fetchStatus = async () => {
        if (!queueID) return
        try {
            const res = await fetch(`/api/auth/queue-status?queueID=${queueID}`)
            if (res.ok) {
                const data = await res.json()
                setStatusData(data)
                setLastUpdated(new Date())
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStatus()
        const interval = setInterval(fetchStatus, 5000)
        return () => clearInterval(interval)
    }, [queueID])

    if (!queueID) return <MissingIDState />
    if (loading && !statusData) return <LoadingState />
    if (statusData?.status === "APPROVED") return <ApprovedState />
    if (statusData?.status === "REJECTED") return <RejectedState />

    // Section 1: Animated Header
    return (
        <div className="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-cyan-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">

                {/* Section 1: Animated Header */}
                <div className="text-center py-16 px-5 bg-gradient-to-br from-[#0F172A] to-[#1e293b] border-b border-violet-500/20 rounded-t-3xl -mt-6 -mx-6 mb-8 shadow-2xl relative overflow-hidden">

                    {/* Background Pulse Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider bg-orange-400/15 text-orange-400 border border-orange-400/30 mb-6 animate-in slide-in-from-top-4 fade-in duration-700">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shadow-[0_0_10px_#fb923c]"></span>
                        PENDING APPROVAL
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-150 fill-mode-both" style={{ animationFillMode: 'both', animationDelay: '150ms' }}>
                        You're in the Queue! 🚀
                    </h1>

                    <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300 fill-mode-both" style={{ animationFillMode: 'both', animationDelay: '300ms' }}>
                        Your application is being reviewed by our admin team. We'll notify you as soon as it's approved.
                        <br />
                        <span className="text-xs font-mono text-slate-500 mt-2 block">
                            Identity: <span className="text-orange-300">{statusData?.userName}</span> • Ticket: <span className="text-slate-300">{queueID?.slice(0, 8)}...</span>
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Main Status) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Section 2: Queue Visualization */}
                        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex flex-col items-center justify-center py-6">
                                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-4">Current Sequence Position</span>
                                    <div className="relative">
                                        <div className="text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                                            {statusData?.position}
                                        </div>
                                        <div className="absolute -right-12 bottom-4 text-xl text-slate-500 font-medium">
                                            / {statusData?.totalQueue}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-center text-slate-400 max-w-xs">
                                        Your request is securely queued. Please do not close your browser if you wish to monitor real-time progress.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                                        <span>Proximity to Approval</span>
                                        <span className="text-cyan-400">{statusData?.approvalPercentage}%</span>
                                    </div>
                                    <Progress value={statusData?.approvalPercentage} className="h-1 bg-slate-800" indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 5: Queue Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                icon={<Users className="w-4 h-4 text-purple-400" />}
                                label="Ahead of You"
                                value={statusData?.usersAhead.toString() || "0"}
                            />
                            <StatCard
                                icon={<CheckCircle2 className="w-4 h-4 text-green-400" />}
                                label="Approvals Today"
                                value={statusData?.approvalsToday.toString() || "0"}
                            />
                            <StatCard
                                icon={<Clock className="w-4 h-4 text-orange-400" />}
                                label="Est. Wait Time"
                                value={statusData?.avgWaitTime || "--"}
                            />
                            <StatCard
                                icon={<Activity className="w-4 h-4 text-blue-400" />}
                                label="Network Load"
                                value="Stable"
                            />
                        </div>

                    </div>

                    {/* Right Column (Timeline & Info) */}
                    <div className="space-y-6">

                        {/* Section 4: Real-time Updates Box */}
                        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                    <div className="text-xs">
                                        <p className="text-slate-300 font-medium">Live Connection</p>
                                        <p className="text-slate-500">{lastUpdated?.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-white"
                                    onClick={() => fetchStatus()}
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Section 3: Status Timeline */}
                        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
                            <CardContent className="p-6">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">Process Timeline</h3>
                                <div className="space-y-6 relative ml-2">
                                    <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-slate-800"></div>

                                    <TimelineItem
                                        status="completed"
                                        title="Application Submitted"
                                        date={new Date(statusData?.submittedAt || "").toLocaleDateString()}
                                    />
                                    <TimelineItem
                                        status="active"
                                        title="Under Review"
                                        description="Admin is verifying details"
                                    />
                                    <TimelineItem
                                        status="pending"
                                        title="Approval Pending"
                                    />
                                    <TimelineItem
                                        status="pending"
                                        title="Account Activation"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 6: Help & Support */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-between bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:text-cyan-400 group"
                                onClick={() => setFaqOpen(faqOpen === 'q1' ? null : 'q1')}
                            >
                                <span className="text-xs font-mono uppercase tracking-wider">How long does this take?</span>
                                {faqOpen === 'q1' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </Button>
                            {faqOpen === 'q1' && (
                                <div className="p-3 text-xs text-slate-400 bg-slate-950/30 rounded border border-slate-800/50">
                                    Approvals usually take between 24-48 hours depending on administrative load.
                                </div>
                            )}

                            <Link href="mailto:support@example.com" className="block">
                                <Button variant="ghost" className="w-full text-xs text-slate-500 hover:text-white">
                                    Contact Support Team
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{label}</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">{value}</div>
        </div>
    )
}

function TimelineItem({ status, title, description, date }: { status: 'completed' | 'active' | 'pending', title: string, description?: string, date?: string }) {
    return (
        <div className="relative pl-6">
            <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 z-10 bg-[#020817] ${status === 'completed' ? 'border-green-500 bg-green-500' :
                    status === 'active' ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' :
                        'border-slate-700'
                }`}></div>

            <div className={`${status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                <h4 className={`text-sm font-medium ${status === 'active' ? 'text-cyan-400' : 'text-slate-200'}`}>{title}</h4>
                {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
                {date && <p className="text-[10px] font-mono text-slate-600 mt-1">{date}</p>}
            </div>
        </div>
    )
}

// Simple Components for other states to keep file clean-ish
function MissingIDState() {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
            <Card className="bg-slate-900 border-slate-800 text-white max-w-md w-full p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Queue ID Missing</h2>
                <p className="text-slate-400 mb-6 text-sm">Valid sequence identifier not returned. Please restart auth flow.</p>
                <Link href="/register"><Button className="w-full">Return to Registration</Button></Link>
            </Card>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="relative mx-auto w-12 h-12">
                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-cyan-500/50 font-mono text-xs animate-pulse tracking-widest">ESTABLISHING_UPLINK...</p>
            </div>
        </div>
    )
}

function ApprovedState() {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mx-auto w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Access Granted</h1>
                    <p className="text-slate-400">Your credentials have been verified.</p>
                </div>
                <Link href="/login">
                    <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                        Enter Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function RejectedState() {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mx-auto w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                    <ShieldCheck className="w-16 h-16 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                    <p className="text-slate-400">Your application criteria was not met at this time.</p>
                </div>
                <Link href="/">
                    <Button variant="outline" className="w-full border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800">
                        Terminate Session
                    </Button>
                </Link>
            </div>
        </div>
    )
}
