import React, { useState } from 'react';
import { Layers, Shield, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DiffEditor, Editor } from '@monaco-editor/react';

// Updated types to support both Legacy Single-File and Enterprise Multi-File
interface AgentResult {
    type: string;
    issues: any[];
    score: number;
    summary: string;
    refactoredCode?: string;
}

interface FileEntry {
    id: string;
    path: string;
    score: number;
}

export interface ReviewData {
    status: string;
    reviewId: string;
    summary?: string;
    qualityScore?: number;
    originalCode?: string; // Phase 11: Added for Diff View
    results?: AgentResult[]; // Legacy Single File Results
    files?: FileEntry[]; // Enterprise Multi-File
}

interface ReviewDisplayProps {
    review: ReviewData;
}

const SeverityBadge = ({ severity }: { severity: string }) => {
    const colors: any = {
        critical: 'bg-red-500/10 text-red-500 border-red-500/20',
        major: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        minor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        high: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return (
        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', colors[severity] || colors.minor)}>
            {severity.toUpperCase()}
        </span>
    );
};

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ review }) => {
    const [activeTab, setActiveTab] = useState<string>('Overview');

    // Enterprise Multi-File Logic (Simple List View for now)
    if (review.files && review.files.length > 0) {
        return (
            <div className="space-y-6">
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                    <h2 className="text-xl font-semibold text-white mb-2">Repository Analysis</h2>
                    <p className="text-neutral-400">{review.summary}</p>
                    <div className="mt-4">
                        <h3 className="font-bold text-white mb-2">Files Analyzed ({review.files.length})</h3>
                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
                            {review.files.map((file) => (
                                <div key={file.id} className="p-3 border-b border-neutral-800 last:border-0 flex justify-between hover:bg-neutral-900 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-cyan-500" />
                                        <span className="text-neutral-300 font-mono text-sm">{file.path}</span>
                                    </div>
                                    <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded">View Analysis</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Legacy Single File Logic
    if (!review.results) {
        return <div>Loading detailed results...</div>;
    }

    const overallScore = review.qualityScore || 0;
    const scoreColor = overallScore >= 80 ? 'text-green-400' : overallScore >= 60 ? 'text-yellow-400' : 'text-red-400';
    const tabs = ['Overview', ...review.results.map(r => r.type)];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header & Score */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-1">Enterprise Analysis</h2>
                        <div className="text-sm text-neutral-400">Review ID: <span className="font-mono text-cyan-500">{review.reviewId.split('-')[0]}</span></div>
                    </div>
                    <div className="text-center mr-12">
                        <div className={`text-4xl font-bold ${scoreColor}`}>{overallScore}</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider">Quality Score</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            activeTab === tab
                                ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        )}
                    >
                        {tab === 'Overview' ? <Layers className="w-4 h-4 inline mr-2" /> : null}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden min-h-[400px]">
                {activeTab === 'Overview' && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Executive Summary</h3>
                        <p className="text-neutral-300 leading-relaxed max-w-2xl whitespace-pre-line">{review.summary}</p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {review.results.map((r, i) => (
                                <div key={i} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-neutral-400">{r.type}</span>
                                        <span className={cn("text-sm font-bold", r.score >= 80 ? "text-green-500" : "text-yellow-500")}>{r.score}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-900" style={{ width: `${r.score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic Agent Tabs */}
                {review.results.map(result => (
                    activeTab === result.type && (
                        <div key={result.type} className="divide-y divide-neutral-800">
                            <div className="p-4 bg-neutral-950/30">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold text-white">{result.type} Report</h3>
                                    <span className="text-sm text-neutral-500">Agent Score: {result.score}</span>
                                </div>
                                <p className="text-sm text-neutral-400 mt-2">{result.summary}</p>
                            </div>

                            {result.type === 'REFACTOR' ? (
                                <div className="h-[500px] border border-neutral-800 rounded-lg overflow-hidden">
                                    {/* Diff Editor is handled below, this block is for standard display if not refactor */}
                                    <DiffEditor
                                        height="100%"
                                        language="javascript"
                                        original={review.originalCode || "// Original code not available for diff"}
                                        modified={result.refactoredCode}
                                        theme="vs-dark"
                                        options={{ readOnly: true, renderSideBySide: true, minimap: { enabled: false }, fontSize: 13 }}
                                    />
                                </div>
                            ) : (
                                <div className="h-[500px] border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
                                    <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex justify-between items-center">
                                        <span className="text-xs text-neutral-400">Inline Analysis View</span>
                                    </div>
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        value={review.originalCode || "// Code not available"}
                                        theme="vs-dark"
                                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                                        onMount={(editor, monaco) => {
                                            const markers = result.issues.map((issue: any) => ({
                                                startLineNumber: issue.line || 1,
                                                startColumn: 1,
                                                endLineNumber: issue.line || 1,
                                                endColumn: 1000,
                                                message: `[${issue.type}] ${issue.description} \nSuggestion: ${issue.suggestion}`,
                                                severity: issue.severity === 'critical' || issue.severity === 'high'
                                                    ? monaco.MarkerSeverity.Error
                                                    : monaco.MarkerSeverity.Warning
                                            }));
                                            monaco.editor.setModelMarkers(editor.getModel()!, "owner", markers);
                                        }}
                                    />
                                    {/* List View below for accessibility/details */}
                                    <div className="h-48 overflow-y-auto border-t border-neutral-800 bg-neutral-950 p-4">
                                        {result.issues.map((issue: any, idx: number) => (
                                            <div key={idx} className="mb-2 text-sm text-neutral-400 border-l-2 border-cyan-500 pl-2">
                                                <span className="font-bold text-white">L{issue.line || '?'}:</span> {issue.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};
