"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ExternalLink, Eye, MousePointer } from "lucide-react";
import Link from "next/link";

type AnalyticsItem = {
    id: string;
    type: string;
    slug: string;
    views: number;
    clicks: number;
    updatedAt: string;
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/analytics", { cache: "no-store" });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Failed to load");
            setData(json.analytics || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const totalViews = data.reduce((acc, item) => acc + item.views, 0);
    const totalClicks = data.reduce((acc, item) => acc + item.clicks, 0);
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

    const mostViewed = [...data].sort((a, b) => b.views - a.views)[0];
    const topProject = data.filter(i => i.type === 'project').sort((a, b) => b.views - a.views)[0];
    const topCaseStudy = data.filter(i => i.type === 'case-study').sort((a, b) => b.views - a.views)[0];

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                </div>
                <Button variant="outline" asChild>
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        Google Analytics <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
            </div>

            {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading analytics data...</div>
            ) : error ? (
                <div className="p-8 text-center text-red-500">Error: {error}</div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalViews}</div>
                                <p className="text-xs text-muted-foreground">Across all tracked items</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                                <MousePointer className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalClicks}</div>
                                <p className="text-xs text-muted-foreground">Conversion: {conversionRate}%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top Project</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate text-ellipsis overflow-hidden whitespace-nowrap" title={topProject?.slug || "-"}>
                                    {topProject ? topProject.slug : "-"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {topProject ? `${topProject.views} views` : "No data"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top Case Study</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate text-ellipsis overflow-hidden whitespace-nowrap" title={topCaseStudy?.slug || "-"}>
                                    {topCaseStudy ? topCaseStudy.slug : "-"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {topCaseStudy ? `${topCaseStudy.views} views` : "No data"}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">CTR</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="capitalize">{item.type}</TableCell>
                                            <TableCell className="font-medium">{item.slug}</TableCell>
                                            <TableCell className="text-right">{item.views}</TableCell>
                                            <TableCell className="text-right">{item.clicks}</TableCell>
                                            <TableCell className="text-right">
                                                {item.views > 0 ? ((item.clicks / item.views) * 100).toFixed(1) : "0.0"}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                No analytics data found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
