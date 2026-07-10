import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, 
  Clock, PenTool, Download, Trash2, X 
} from 'lucide-react';

type DocStatus = 'idle' | 'draft' | 'in_review' | 'signed';

export default function DocumentChamber() {
  const [status, setStatus] = useState<DocStatus>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  
  // Signature Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // --- Handlers ---
  
  const handleMockUpload = () => {
    setFileName("Series_A_Term_Sheet_Final.pdf");
    setStatus('draft');
  };

  const handleClearDoc = () => {
    setStatus('idle');
    setFileName(null);
    setHasSignature(false);
  };

  const advanceStatus = (newStatus: DocStatus) => {
    setStatus(newStatus);
  };

  // --- Canvas Drawing Logic ---
  
  // Set up canvas context when modal opens
  useEffect(() => {
    if (showSignModal && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2e1065'; // Deep violet ink
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [showSignModal]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    // Get correct mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const confirmSignature = () => {
    if (hasSignature) {
      setShowSignModal(false);
      setStatus('signed');
    }
  };

  // --- UI Helpers ---

  const renderStatusBadge = () => {
    switch (status) {
      case 'draft':
        return <span className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider"><FileText className="w-3 h-3 mr-1" /> Draft</span>;
      case 'in_review':
        return <span className="flex items-center px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-bold uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> In Review</span>;
      case 'signed':
        return <span className="flex items-center px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-bold uppercase tracking-wider"><CheckCircle className="w-3 h-3 mr-1" /> Signed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-primary-950 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary-300" />
            Document Chamber
          </h2>
          <p className="text-primary-200 text-sm mt-1">Secure contract generation and e-signatures</p>
        </div>
        <div>
          {renderStatusBadge()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        
        {/* STATE 1: IDLE / UPLOAD */}
        {status === 'idle' && (
          <div 
            onClick={handleMockUpload}
            className="border-2 border-dashed border-primary-200 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-50 hover:border-primary-400 transition-colors group"
          >
            <div className="p-4 bg-primary-100 rounded-full text-primary-600 group-hover:scale-110 transition-transform mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Contract or Deal Doc</h3>
            <p className="text-gray-500 text-sm max-w-sm mb-4">Drag and drop your PDF here, or click to browse files from your computer.</p>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-md">
              Click to mock upload
            </span>
          </div>
        )}

        {/* STATE 2, 3, 4: PREVIEW & ACTIONS */}
        {status !== 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Document Preview */}
            <div className="lg:col-span-2 border border-gray-200 rounded-xl bg-gray-50 flex flex-col overflow-hidden h-[500px]">
              <div className="bg-gray-200 px-4 py-2 flex items-center justify-between border-b border-gray-300">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  {fileName}
                </span>
                <button onClick={handleClearDoc} className="text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Mock PDF Content */}
              <div className="flex-1 p-8 overflow-y-auto bg-white m-4 rounded shadow-sm font-serif text-gray-800 text-sm leading-relaxed border border-gray-100">
                <h1 className="text-xl font-bold text-center mb-6 uppercase">Series A Investment Term Sheet</h1>
                <p className="mb-4">This Term Sheet summarizes the principal terms of the Series A Preferred Stock financing of Business Nexus, Inc. (the "Company").</p>
                <p className="font-bold mt-4">1. Offering Terms</p>
                <p className="mb-4">The Investors will purchase an aggregate of $5,000,000 of Series A Preferred Stock at a price of $2.50 per share.</p>
                <p className="font-bold mt-4">2. Liquidation Preference</p>
                <p className="mb-4">In the event of any liquidation or winding up of the Company, the holders of the Series A Preferred shall be entitled to receive in preference to the holders of the Common Stock.</p>
                
                {status === 'signed' && (
                  <div className="mt-12 pt-6 border-t border-gray-300">
                    <p className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Digitally Signed By</p>
                    <div className="w-48 h-16 bg-primary-50 border border-primary-100 flex items-center justify-center rounded text-primary-800 font-bold italic" style={{ fontFamily: 'cursive' }}>
                      Signature Verified
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Actions & Status Timeline */}
            <div className="space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Document Actions</h3>
                
                {status === 'draft' && (
                  <button 
                    onClick={() => advanceStatus('in_review')}
                    className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Submit for Review
                  </button>
                )}

                {status === 'in_review' && (
                  <button 
                    onClick={() => setShowSignModal(true)}
                    className="w-full py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center"
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Sign Document
                  </button>
                )}

                {status === 'signed' && (
                  <button className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                )}                                                          
              </div>

              {/* Status Timeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Pipeline Status</h3>
                <div className="space-y-4">
                  <div className={`flex items-center ${status === 'idle' ? 'text-gray-400' : 'text-primary-700'}`}>
                    <div className={`w-3 h-3 rounded-full mr-3 ${status !== 'idle' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Uploaded Draft</span>
                  </div>
                  <div className="w-0.5 h-4 bg-gray-200 ml-1.5 -my-2"></div>
                  <div className={`flex items-center ${status === 'in_review' || status === 'signed' ? 'text-primary-700' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full mr-3 ${status === 'in_review' || status === 'signed' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Under Review</span>
                  </div>
                  <div className="w-0.5 h-4 bg-gray-200 ml-1.5 -my-2"></div>
                  <div className={`flex items-center ${status === 'signed' ? 'text-success-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full mr-3 ${status === 'signed' ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Fully Executed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SIGNATURE MODAL OVERLAY */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-in">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Sign Document</h3>
              <button onClick={() => setShowSignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Please draw your signature in the box below to legally sign this document.</p>
              
              {/* HTML5 Signature Canvas */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden relative cursor-crosshair">
                <canvas 
                  ref={canvasRef}
                  width={450}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-48 touch-none"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-gray-300 font-medium text-lg select-none">Draw signature here</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={clearSignature}
                  className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear Pad
                </button>
                <div className="space-x-3">
                  <button 
                    onClick={() => setShowSignModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmSignature}
                    disabled={!hasSignature}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                      hasSignature 
                        ? 'bg-success-600 hover:bg-success-700 text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Confirm Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}