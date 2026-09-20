import React, { useState } from 'react';
import {
  ArrowDownToLine,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogsViewProps {
  logs: AuditLogItem[];
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, onShowToast }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('2025-09-10');
  const [endDate, setEndDate] = useState('2025-09-16');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.document.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || log.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const handleExportCsv = () => {
    const headers = 'Timestamp,Action,Document,RiskLevel,UserEmail,Status\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.timestamp}","${l.action}","${l.document}","${l.riskLevel}","${l.userEmail}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privexa_ai_audit_logs_${startDate}_to_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported audit trail to CSV', 'success');
  };

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header section matching Screen 10 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track all activities and events in your account.
          </p>
        </div>

        {/* Date Range Picker matching Screen 10 */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-24 bg-transparent outline-none text-slate-800"
          />
          <span className="text-slate-400 font-bold">→</span>
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-24 bg-transparent outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, document, or user..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Severity:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Logs Table matching Screen 10 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 font-medium whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 font-mono">
                    {log.document}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${getRiskBadge(
                        log.riskLevel
                      )}`}
                    >
                      {log.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {log.userEmail}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Screen 10 */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {Math.min(filteredLogs.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredLogs.length, currentPage * pageSize)} of {filteredLogs.length} events
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md font-bold text-xs transition-colors ${
                  currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
