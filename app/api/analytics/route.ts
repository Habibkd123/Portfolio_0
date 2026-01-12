import { hygraphAdmin } from '@/lib/hygraph';
import { INCREMENT_ANALYTICS_VIEWS, INCREMENT_ANALYTICS_CLICKS, GET_ANALYTICS_BY_TYPE_AND_SLUG } from '@/graphql/analyticsMutations';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, slug, action = 'view' } = await request.json();

    if (!type || !slug) {
      return NextResponse.json(
        { error: 'Type and slug are required' },
        { status: 400 }
      );
    }

    let result;
    
    if (action === 'view') {
      result = await hygraphAdmin.request(INCREMENT_ANALYTICS_VIEWS, {
        type,
        slug,
      });
    } else if (action === 'click') {
      result = await hygraphAdmin.request(INCREMENT_ANALYTICS_CLICKS, {
        type,
        slug,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "view" or "click"' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');

  if (!type || !slug) {
    return NextResponse.json(
      { error: 'Type and slug are required' },
      { status: 400 }
    );
  }

  try {
    const data = await hygraphAdmin.request(GET_ANALYTICS_BY_TYPE_AND_SLUG, {
      type,
      slug,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
