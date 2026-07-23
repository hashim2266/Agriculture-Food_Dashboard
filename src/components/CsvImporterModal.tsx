import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  FileSpreadsheet,
  Upload,
  BarChart2,
  Table,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Sparkles,
  Calculator,
  RefreshCw,
  TrendingUp,
  FileCode,
  Grid
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface CsvImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataImported?: (
    datasetName: string,
    rows: Record<string, any>[],
    xAxis: string,
    yAxis: string,
    chartType: 'line' | 'bar' | 'area'
  ) => void;
}

// Sample CSV from user (Fish Landings open.dosm.gov.my)
const SAMPLE_FISH_LANDINGS_CSV = `date,coast,state,landings
2018-01-01,all,Malaysia,97405
2018-02-01,all,Malaysia,97467
2018-03-01,all,Malaysia,117813
2018-04-01,all,Malaysia,127202
2018-05-01,all,Malaysia,129453
2018-06-01,all,Malaysia,128464
2018-07-01,all,Malaysia,132056
2018-08-01,all,Malaysia,132023
2018-09-01,all,Malaysia,132223
2018-10-01,all,Malaysia,131884
2018-11-01,all,Malaysia,120240
2018-12-01,all,Malaysia,106543
2019-01-01,all,Malaysia,100462
2019-02-01,all,Malaysia,104522
2019-03-01,all,Malaysia,125360
2019-04-01,all,Malaysia,131565
2019-05-01,all,Malaysia,129754
2019-06-01,all,Malaysia,125809
2019-07-01,all,Malaysia,126728
2019-08-01,all,Malaysia,125668
2019-09-01,all,Malaysia,132718
2019-10-01,all,Malaysia,133859
2019-11-01,all,Malaysia,122082
2019-12-01,all,Malaysia,96825
2020-01-01,all,Malaysia,99867
2020-02-01,all,Malaysia,121782
2020-03-01,all,Malaysia,111214
2020-04-01,all,Malaysia,104408
2020-05-01,all,Malaysia,108295
2020-06-01,all,Malaysia,124092
2020-07-01,all,Malaysia,122060
2020-08-01,all,Malaysia,126611
2020-09-01,all,Malaysia,123311
2020-10-01,all,Malaysia,123181
2020-11-01,all,Malaysia,116856
2020-12-01,all,Malaysia,101625
2021-01-01,all,Malaysia,90179
2021-02-01,all,Malaysia,92061
2021-03-01,all,Malaysia,115532
2021-04-01,all,Malaysia,121013
2021-05-01,all,Malaysia,116078
2021-06-01,all,Malaysia,114944
2021-07-01,all,Malaysia,124343
2021-08-01,all,Malaysia,125226
2021-09-01,all,Malaysia,116715
2021-10-01,all,Malaysia,117695
2021-11-01,all,Malaysia,103996
2021-12-01,all,Malaysia,90170
2022-01-01,all,Malaysia,91102
2022-02-01,all,Malaysia,98025
2022-03-01,all,Malaysia,117950
2022-04-01,all,Malaysia,127996
2022-05-01,all,Malaysia,114772
2022-06-01,all,Malaysia,115104
2022-07-01,all,Malaysia,119858
2022-08-01,all,Malaysia,120914
2022-09-01,all,Malaysia,111056
2022-10-01,all,Malaysia,108029
2022-11-01,all,Malaysia,97884
2022-12-01,all,Malaysia,85726
2023-01-01,all,Malaysia,80422
2023-02-01,all,Malaysia,85853
2023-03-01,all,Malaysia,100296
2023-04-01,all,Malaysia,106361
2023-05-01,all,Malaysia,112338
2023-06-01,all,Malaysia,115663
2023-07-01,all,Malaysia,120006
2023-08-01,all,Malaysia,111734
2023-09-01,all,Malaysia,113007
2023-10-01,all,Malaysia,119579
2023-11-01,all,Malaysia,114726
2023-12-01,all,Malaysia,90300`;

export const CsvImporterModal: React.FC<CsvImporterModalProps> = ({
  isOpen,
  onClose,
  onDataImported
}) => {
  const [csvText, setCsvText] = useState<string>('');
  const [datasetName, setDatasetName] = useState<string>('Pendaratan_Ikan_OpenDOSM.csv');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbookRef, setWorkbookRef] = useState<XLSX.WorkBook | null>(null);

  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>('');
  const [selectedYAxis, setSelectedYAxis] = useState<string>('');
  const [filterCoast, setFilterCoast] = useState<string>('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [activeTab, setActiveTab] = useState<'upload' | 'visualize' | 'table'>('upload');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load sample dataset on mount or button click
  const loadSampleData = () => {
    setCsvText(SAMPLE_FISH_LANDINGS_CSV);
    setDatasetName('Pendaratan_Ikan_OpenDOSM.csv');
    parseCsvContent(SAMPLE_FISH_LANDINGS_CSV);
    setSuccessMsg('Set data sampel Pendaratan Ikan (OpenDOSM) berjaya dimuatkan!');
  };

  // Extract structure from row objects array
  const processRawRowObjects = (rows: Record<string, any>[]) => {
    if (rows.length === 0) {
      setError('Tiada data ditemui dalam fail.');
      return;
    }

    const headers = Object.keys(rows[0]);
    setParsedHeaders(headers);
    setParsedRows(rows);

    // Auto pick X and Y axes
    if (headers.includes('date')) setSelectedXAxis('date');
    else if (headers.includes('tahun')) setSelectedXAxis('tahun');
    else if (headers.includes('year')) setSelectedXAxis('year');
    else setSelectedXAxis(headers[0]);

    const numericHeader = headers.find((h) => {
      return rows.length > 0 && typeof rows[0][h] === 'number';
    });

    if (numericHeader) setSelectedYAxis(numericHeader);
    else setSelectedYAxis(headers[headers.length - 1]);

    setActiveTab('visualize');
  };

  // Parse CSV text
  const parseCsvContent = (content: string) => {
    try {
      setError(null);
      const wb = XLSX.read(content, { type: 'string' });
      const firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

      setWorkbookRef(wb);
      setSheetNames(wb.SheetNames);
      setSelectedSheet(firstSheetName);
      processRawRowObjects(jsonRows);
    } catch (err: any) {
      setError('Gagal membaca format CSV. Sila pastikan fail mengandungi teks CSV yang sah.');
    }
  };

  // Handle Sheet selection change for multi-sheet Excel files
  const handleSheetChange = (sheetName: string) => {
    if (!workbookRef) return;
    setSelectedSheet(sheetName);
    const sheet = workbookRef.Sheets[sheetName];
    const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
    processRawRowObjects(jsonRows);
    setSuccessMsg(`Helaian (Sheet) "${sheetName}" berjaya dimuatkan!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDatasetName(file.name);
    setError(null);

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isJson = file.name.endsWith('.json');

    const reader = new FileReader();

    if (isExcel) {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });
          setWorkbookRef(wb);
          setSheetNames(wb.SheetNames);
          const firstSheet = wb.SheetNames[0];
          setSelectedSheet(firstSheet);

          const sheet = wb.Sheets[firstSheet];
          const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
          processRawRowObjects(jsonRows);
          setSuccessMsg(`Fail Excel "${file.name}" (${jsonRows.length} rekod) berjaya dimuat masuk!`);
        } catch (err: any) {
          setError('Gagal membaca fail Excel. Pastikan format .xlsx atau .xls adalah sah.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (isJson) {
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const json = JSON.parse(text);
          const arrayData = Array.isArray(json) ? json : [json];
          processRawRowObjects(arrayData);
          setSuccessMsg(`Fail JSON "${file.name}" berjaya dimuat masuk!`);
        } catch (err: any) {
          setError('Gagal membaca fail JSON. Pastikan sintaks JSON adalah sah.');
        }
      };
      reader.readAsText(file);
    } else {
      // Default CSV or Text
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvText(text);
        parseCsvContent(text);
        setSuccessMsg(`Fail CSV "${file.name}" berjaya dimuat masuk dan diproses!`);
      };
      reader.readAsText(file);
    }
  };

  // Export filtered dataset to Excel (.xlsx)
  const exportToExcel = () => {
    if (filteredRows.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Pertanian');
    
    const exportFileName = datasetName.replace(/\.[^/.]+$/, '') + '_Export.xlsx';
    XLSX.writeFile(workbook, exportFileName);
    setSuccessMsg(`Data berjaya dieksport ke fail Excel: ${exportFileName}`);
  };

  // Filter options if "coast" column exists
  const coastOptions = useMemo(() => {
    if (!parsedHeaders.includes('coast')) return [];
    const setValues = new Set<string>();
    parsedRows.forEach((r) => {
      if (r.coast) setValues.add(String(r.coast));
    });
    return Array.from(setValues);
  }, [parsedHeaders, parsedRows]);

  // Filtered dataset for charts and table
  const filteredRows = useMemo(() => {
    if (parsedHeaders.includes('coast') && filterCoast !== 'all') {
      return parsedRows.filter((r) => String(r.coast) === filterCoast);
    }
    return parsedRows;
  }, [parsedRows, filterCoast, parsedHeaders]);

  // Statistical metrics for selected Y axis
  const stats = useMemo(() => {
    if (!selectedYAxis || filteredRows.length === 0) return null;
    const values = filteredRows
      .map((r) => Number(r[selectedYAxis]))
      .filter((v) => !isNaN(v));

    if (values.length === 0) return null;

    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      count: values.length,
      sum,
      avg,
      max,
      min,
    };
  }, [filteredRows, selectedYAxis]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#121215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#18181d]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Penyedut Data Excel (.xlsx, .xls) & CSV Open Data
              </h2>
              <p className="text-xs text-slate-400">
                Sokongan Penuh Fail Excel (Excel Spreadsheets), CSV & JSON daripada open.dosm.gov.my, data.gov.my & KPKM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-2.5 bg-black/40 border-b border-white/10 text-xs gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Muat Masuk Excel / CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('visualize')}
              disabled={parsedRows.length === 0}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'visualize'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Visual Graf ({parsedRows.length} Rekod)</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              disabled={parsedRows.length === 0}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'table'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Jadual Data</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {parsedRows.length > 0 && (
              <button
                onClick={exportToExcel}
                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg font-bold transition-all flex items-center gap-1.5"
                title="Eksport data ini ke fail Excel .xlsx"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eksport Excel (.xlsx)</span>
              </button>
            )}

            <button
              onClick={loadSampleData}
              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-lg font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sampel OpenDOSM</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sheet Selector if Excel File has multiple sheets */}
          {sheetNames.length > 1 && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Grid className="w-4 h-4" />
                <span>Fail Excel Mengandungi {sheetNames.length} Helaian (Sheets):</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-400 font-medium">Pilih Sheet:</label>
                <select
                  value={selectedSheet}
                  onChange={(e) => handleSheetChange(e.target.value)}
                  className="px-3 py-1 bg-[#121215] border border-white/10 rounded-lg text-white font-bold focus:outline-none"
                >
                  {sheetNames.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 1: UPLOAD / PASTE CSV */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Drag & Drop Upload */}
                <div className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.json,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Muat Naik Fail Excel (.xlsx / .xls), CSV atau JSON
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Pilih fail spreadsheet Excel `.xlsx` / `.xls` atau CSV daripada OpenDOSM, data.gov.my, atau KPKM
                  </p>
                </div>

                {/* Paste CSV directly */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Atau Tampal Teks CSV / JSON Di Sini:
                  </label>
                  <textarea
                    rows={8}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Contoh:&#10;date,coast,state,landings&#10;2018-01-01,all,Malaysia,97405&#10;2018-02-01,all,Malaysia,97467"
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none"
                  />
                  <button
                    onClick={() => parseCsvContent(csvText)}
                    disabled={!csvText.trim()}
                    className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl shadow-md shadow-emerald-500/20 text-xs transition-all disabled:opacity-50"
                  >
                    Proses & Menganalisis Teks CSV
                  </button>
                </div>
              </div>

              {/* Format Support Banner */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Calculator className="w-4 h-4" />
                  <span>Format Yang Disokong Sepenuhnya:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="font-bold text-emerald-300 block">1. Excel Spreadsheets (.xlsx, .xls)</span>
                    <span className="text-[11px] text-slate-400">Sokongan pelbagai worksheet (multiple sheets)</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="font-bold text-emerald-300 block">2. CSV (Comma Separated)</span>
                    <span className="text-[11px] text-slate-400">Format OpenDOSM & data.gov.my standard</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="font-bold text-emerald-300 block">3. JSON API Data</span>
                    <span className="text-[11px] text-slate-400">Objek data terstruktur dari API rasmi</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUALIZE CHARTS */}
          {activeTab === 'visualize' && parsedRows.length > 0 && (
            <div className="space-y-4">
              {/* Controls Bar */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Paksi X (Kategori / Tarikh)</label>
                  <select
                    value={selectedXAxis}
                    onChange={(e) => setSelectedXAxis(e.target.value)}
                    className="w-full p-2 bg-[#121215] border border-white/10 rounded-xl text-white font-medium focus:outline-none"
                  >
                    {parsedHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Paksi Y (Nilai / Hasil)</label>
                  <select
                    value={selectedYAxis}
                    onChange={(e) => setSelectedYAxis(e.target.value)}
                    className="w-full p-2 bg-[#121215] border border-white/10 rounded-xl text-white font-medium focus:outline-none"
                  >
                    {parsedHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {coastOptions.length > 0 && (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Penapis Pesisir / Wilayah (coast)</label>
                    <select
                      value={filterCoast}
                      onChange={(e) => setFilterCoast(e.target.value)}
                      className="w-full p-2 bg-[#121215] border border-white/10 rounded-xl text-white font-medium focus:outline-none"
                    >
                      <option value="all">Semua Pesisir (all)</option>
                      {coastOptions.map((c) => (
                        <option key={c} value={c}>
                          Pesisir: {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Jenis Graf</label>
                  <div className="flex items-center gap-1 bg-[#121215] p-1 border border-white/10 rounded-xl">
                    <button
                      onClick={() => setChartType('line')}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        chartType === 'line' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      Garis
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        chartType === 'bar' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      Bar
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        chartType === 'area' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      Kawasan
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistical Highlights */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Jumlah Keseluruhan</span>
                    <span className="text-base font-bold text-emerald-400">
                      {stats.sum.toLocaleString('ms-MY')}
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Purata (Mean)</span>
                    <span className="text-base font-bold text-white">
                      {stats.avg.toLocaleString('ms-MY', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Nilai Maksimum</span>
                    <span className="text-base font-bold text-teal-300">
                      {stats.max.toLocaleString('ms-MY')}
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Nilai Minimum</span>
                    <span className="text-base font-bold text-amber-400">
                      {stats.min.toLocaleString('ms-MY')}
                    </span>
                  </div>
                </div>
              )}

              {/* Chart Render Container */}
              <div className="p-5 bg-black/50 border border-white/10 rounded-2xl h-[340px] w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Graf: {selectedYAxis} vs {selectedXAxis} ({datasetName})
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {filteredRows.length} data dipaparkan
                  </span>
                </div>

                <ResponsiveContainer width="100%" height="90%">
                  {chartType === 'line' ? (
                    <LineChart data={filteredRows}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey={selectedXAxis} stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#121215', borderColor: '#ffffff20', borderRadius: '12px' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={selectedYAxis}
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ fill: '#10b981', r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={filteredRows}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey={selectedXAxis} stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#121215', borderColor: '#ffffff20', borderRadius: '12px' }}
                      />
                      <Legend />
                      <Bar dataKey={selectedYAxis} fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={filteredRows}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey={selectedXAxis} stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#121215', borderColor: '#ffffff20', borderRadius: '12px' }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey={selectedYAxis}
                        stroke="#10b981"
                        fill="#10b98125"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 3: TABLE VIEW */}
          {activeTab === 'table' && parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Menunjukkan {filteredRows.length} daripada {parsedRows.length} rekod
                </span>
                <span className="font-mono text-emerald-400 font-bold">{datasetName}</span>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-2xl max-h-[360px] bg-black/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#18181d] text-slate-300 font-bold border-b border-white/10 sticky top-0">
                    <tr>
                      <th className="p-3 border-r border-white/10 w-12 text-center">#</th>
                      {parsedHeaders.map((h) => (
                        <th key={h} className="p-3 border-r border-white/10 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
                    {filteredRows.slice(0, 100).map((row, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="p-2.5 text-center text-slate-500 border-r border-white/5">
                          {index + 1}
                        </td>
                        {parsedHeaders.map((h) => (
                          <td key={h} className="p-2.5 border-r border-white/5 whitespace-nowrap">
                            {typeof row[h] === 'number' ? row[h].toLocaleString('ms-MY') : row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#18181d] flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Sumber Terbuka: open.dosm.gov.my & data.gov.my
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold rounded-xl text-xs transition-all border border-white/10"
            >
              Tutup
            </button>
            {parsedRows.length > 0 && onDataImported && (
              <button
                onClick={() => {
                  onDataImported(
                    datasetName,
                    filteredRows.length > 0 ? filteredRows : parsedRows,
                    selectedXAxis,
                    selectedYAxis,
                    chartType
                  );
                  onClose();
                }}
                className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Papar Graf Dalam Papan Pemuka</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
