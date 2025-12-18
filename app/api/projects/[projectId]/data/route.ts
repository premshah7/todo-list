import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/actions/projects'

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    const project = await getProject(params.projectId)

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({
        members: project.members,
        taskLists: project.taskLists,
    })
}
