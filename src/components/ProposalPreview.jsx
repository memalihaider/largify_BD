import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Mail, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Target,
  FileText,
  Users
} from 'lucide-react';

const ProposalPreview = ({ proposal, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(proposal);
    setIsSaving(false);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate PDF download
    const element = document.createElement('a');
    element.setAttribute('download', `${proposal.clientName}-proposal.pdf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsExporting(false);
  };

  const handleSendToClient = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    alert('Proposal sent successfully!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const TimelineComponent = ({ timeline }) => (
    <div className="space-y-4">
      {timeline.map((phase, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{index + 1}</span>
            </div>
            {index < timeline.length - 1 && (
              <div className="w-0.5 h-12 bg-gray-600 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{phase.phase}</h4>
              <span className="text-blue-400 text-sm font-medium">{phase.duration}</span>
            </div>
            <p className="text-gray-400 text-sm">{phase.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const PricingTable = ({ pricing }) => (
    <div className="bg-gray-700 rounded-lg p-6">
      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
        <DollarSign className="h-5 w-5 text-green-400" />
        <span>Investment Breakdown</span>
      </h4>
      
      <div className="space-y-3 mb-6">
        {pricing.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0">
            <span className="text-gray-300">{item.item}</span>
            <span className="text-white font-medium">{formatCurrency(item.cost)}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-600 pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className="text-white">Total Investment</span>
          <span className="text-green-400">{formatCurrency(pricing.basePrice)}</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Budget range: {formatCurrency(pricing.basePrice)} - {formatCurrency(pricing.maxPrice)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
          
          <button
            onClick={handleSendToClient}
            disabled={isSending}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Mail className="h-4 w-4" />
            )}
            <span>{isSending ? 'Sending...' : 'Send to Client'}</span>
          </button>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="bg-gray-800 rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Business Proposal</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">For: {proposal.clientName}</p>
              <p className="text-blue-100 text-sm">Industry: {proposal.industry}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Generated on</p>
              <p className="text-white font-medium">
                {new Date(proposal.generatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <span>Introduction</span>
            </h2>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{proposal.sections.introduction}</p>
            </div>
          </section>

          {/* Objectives */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-400" />
              <span>Project Objectives</span>
            </h2>
            <div className="bg-gray-700 rounded-lg p-4">
              <ul className="space-y-3">
                {proposal.sections.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Deliverables */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-400" />
              <span>Key Deliverables</span>
            </h2>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="grid gap-3">
                {proposal.sections.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-600 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{index + 1}</span>
                    </div>
                    <span className="text-gray-300">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span>Project Timeline</span>
            </h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <TimelineComponent timeline={proposal.sections.timeline} />
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span>Investment & Pricing</span>
            </h2>
            <PricingTable pricing={proposal.sections.pricing} />
          </section>

          {/* Project Scope */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span>Project Scope</span>
            </h2>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{proposal.projectScope}</p>
            </div>
          </section>

          {/* Closing Notes */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Closing Notes</h2>
            <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg p-4 border border-blue-700">
              <p className="text-gray-300 leading-relaxed">{proposal.sections.closingNotes}</p>
              <div className="mt-4 pt-4 border-t border-blue-700">
                <p className="text-blue-300 text-sm">
                  We look forward to discussing this proposal with you and answering any questions you may have.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProposalPreview;