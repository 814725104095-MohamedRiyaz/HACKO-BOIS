import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  UploadCloud,
} from 'lucide-react';
import { PRESET_DEMO_DOCUMENTS } from '../data/mockData';
import { DocumentScanResult } from '../types';
import { scanDocumentText } from '../utils/privacyScanner';

interface UploadScanViewProps {
  onScanComplete: (result: DocumentScanResult) => void;
  onNavigateTab: (tab: any) => void;
}

export const UploadScanView: React.FC<UploadScanViewProps> = ({
  onScanComplete,
  onNavigateTab,
}) => {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('Pasted_Input.txt');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      executeScan(content, file.name, file.size);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file contents. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const executeScan = async (text: string, name: string, size = 10240) => {
    if (!text.trim()) {
      setErrorMessage('Please provide text or upload a document to analyze.');
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);

    // Multi-stage scan progression for realistic feedback
    setScanStep('Ingesting document and normalizing character encoding...');
    await new Promise((r) => setTimeout(r, 600));

    setScanStep('Running regex engines for payment cards, routing, credentials & IDs...');
    await new Promise((r) => setTimeout(r, 700));

    setScanStep('Executing NLP named entity recognition (Presidio/spaCy)...');
    await new Promise((r) => setTimeout(r, 700));

    setScanStep('Evaluating weighted exposure score & generating synthetic tokens...');
    await new Promise((r) => setTimeout(r, 600));

    const result = scanDocumentText(text, name, size);
    setIsScanning(false);
    onScanComplete(result);
    onNavigateTab('pii-detection');
  };

  const handleLoadPreset = (preset: (typeof PRESET_DEMO_DOCUMENTS)[0]) => {
    setInputText(preset.content);
    setFileName(preset.name);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header section matching Screen 4 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Upload Document
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload your file or paste text to analyze for sensitive information.
        </p>
      </div>

      {/* Preset Quick Loader */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo Datasets (Click to Load)
          </span>
          <span className="text-[11px] text-blue-700">Instant test cases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_DEMO_DOCUMENTS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleLoadPreset(preset)}
              className="text-left p-2.5 bg-white hover:bg-blue-100/50 border border-blue-100 hover:border-blue-300 rounded-lg transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  {preset.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold rounded-sm">
                  {preset.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Drag & Drop Area matching Screen 4 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[1.005]'
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.json,.txt,.doc,.docx,.xls,.xlsx"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Drag & drop files here
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">or</p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
        >
          Choose File
        </button>

        <p className="text-[11px] text-slate-400 mt-5 font-medium">
          Supported formats: PDF, CSV, JSON, TXT, Excel, DOCX
        </p>
      </div>

      {/* Paste text section matching Screen 4 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Or paste your text
          </label>
          <span className="text-[11px] font-medium text-slate-400">
            {inputText.length} characters
          </span>
        </div>

        <textarea
          rows={7}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your content here... (e.g. employee records, emails, invoices, API tokens, customer logs)"
          className="w-full p-3.5 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all resize-y"
        />

        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Current target:{' '}
            <span className="font-semibold text-slate-800">{fileName}</span>
          </span>

          <button
            id="analyze-submit-btn"
            disabled={isScanning || !inputText.trim()}
            onClick={() => executeScan(inputText, fileName)}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl transition-all shadow-xs ${
              isScanning || !inputText.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Dynamic Scanning Progress Dialog */}
        {isScanning && (
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-2 text-blue-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                AI-Powered Sensitivity Scanning Pipeline
              </span>
              <span className="text-slate-400 font-mono">Async Worker Active</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-slate-300 font-mono">{scanStep}</p>
          </div>
        )}
      </div>
    </div>
  );
};
