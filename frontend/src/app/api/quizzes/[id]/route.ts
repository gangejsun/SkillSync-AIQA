import { NextResponse } from 'next/server';
import { mockQuizzes } from '@/lib/mockQuizzes';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const quiz = mockQuizzes.find(q => q.quiz_id === params.id);

        if (!quiz) {
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            challenge: quiz
        });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz' },
            { status: 500 }
        );
    }
}
