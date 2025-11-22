import { NextResponse } from 'next/server';
import { mockQuizzes } from '@/lib/mockQuizzes';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const status = searchParams.get('status');

        let filteredQuizzes = [...mockQuizzes];

        // Apply filters
        if (category && category !== 'all') {
            filteredQuizzes = filteredQuizzes.filter(q => q.category === category);
        }
        if (difficulty && difficulty !== 'all') {
            filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === difficulty);
        }
        if (status && status !== 'all') {
            filteredQuizzes = filteredQuizzes.filter(q => q.status === status);
        }

        return NextResponse.json({
            challenges: filteredQuizzes,
            total: filteredQuizzes.length
        });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quizzes' },
            { status: 500 }
        );
    }
}
