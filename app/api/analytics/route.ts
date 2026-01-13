import { hygraphAdmin } from '@/lib/hygraph';
import {
  GET_ANALYTICS_BY_TYPE_AND_SLUG,
  CREATE_ANALYTICS,
  UPDATE_ANALYTICS_VIEWS,
  UPDATE_ANALYTICS_CLICKS,
  PUBLISH_ANALYTICS
} from '@/graphql/analyticsMutations';
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

    // 1. Check if record exists
    const existing = await hygraphAdmin.request<{ analytics: any[] }>(GET_ANALYTICS_BY_TYPE_AND_SLUG, {
      type,
      slug,
    });

    const record = existing?.analytics?.[0];
    let result;

    if (record) {
      // 2. Update existing
      if (action === 'view') {
        const newViews = (record.views || 0) + 1;
        result = await hygraphAdmin.request(UPDATE_ANALYTICS_VIEWS, {
          id: record.id,
          views: newViews,
        });
      } else if (action === 'click') {
        const newClicks = (record.clicks || 0) + 1;
        result = await hygraphAdmin.request(UPDATE_ANALYTICS_CLICKS, {
          id: record.id,
          clicks: newClicks,
        });
      }

      // Publish the update to ensure it persists directly (optional depending on schema, but good practice)
      await hygraphAdmin.request(PUBLISH_ANALYTICS, { id: record.id });

    } else {
      // 3. Create new
      const initialViews = action === 'view' ? 1 : 0;
      const initialClicks = action === 'click' ? 1 : 0;

      const createRes = await hygraphAdmin.request<{ createAnalytic: any }>(CREATE_ANALYTICS, {
        type,
        slug,
        views: initialViews,
        clicks: initialClicks
      });

      if (createRes?.createAnalytic?.id) {
        await hygraphAdmin.request(PUBLISH_ANALYTICS, { id: createRes.createAnalytic.id });
      }
      result = createRes;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics: ' + error.message },
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
