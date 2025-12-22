import { redirect } from 'next/navigation'

export const revalidate = 60

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params
    redirect(`/projects/${projectId}/board`)
}
