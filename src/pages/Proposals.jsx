import React, { useState } from 'react';
import { ChevronRight, FileText, Plus } from 'lucide-react';
import ProposalForm from '../components/ProposalForm';
import ProposalPreview from '../components/ProposalPreview';
import ProposalTable from '../components/ProposalTable';
import { mockProposals } from '../data/mockProposals';

const Proposals = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [proposals, setProposals] = useState(mockProposals);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Business Development', href: '/dashboard' },
    { label: 'Proposals', href: '/proposals', current: true }
  ];

  const handleProposalGenerated = (proposal) => {
    setGeneratedProposal(proposal);
    setActiveTab('preview');
  };

  const handleProposalSaved = (proposal) => {
    const newProposal = {
      ...proposal,
      id: proposals.length + 1,
      creationDate: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    setProposals([newProposal, ...proposals]);
    setActiveTab('saved');
  };

  const handleSaveProposal = (proposal) => {
    const newProposal = {
      id: Date.now(),
      title: `${proposal.clientName} - ${proposal.industry} Project`,
      clientName: proposal.clientName,
      creationDate: new Date().toLocaleDateString(),
      status: 'Draft',
      ...proposal
    };
    setProposals(prev => [newProposal, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400 mx-2" />}
              <span className={index === breadcrumbItems.length - 1 ? 'text-violet-400 font-medium' : 'text-slate-300 hover:text-white cursor-pointer'}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Page Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">AI-Generated Proposals</h1>
            <p className="mt-2 text-slate-300">Create, manage, and track your business proposals with AI assistance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row">
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex justify-between items-center py-3">
            <span className="text-white font-medium">
              {activeTab === 'generator' && 'Proposal Generator'}
              {activeTab === 'preview' && 'Preview'}
              {activeTab === 'saved' && 'Saved Proposals'}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {/* Tab Buttons */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
            <nav className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0 pb-4 sm:pb-0">
              <button
                onClick={() => {
                  setActiveTab('generator');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg sm:rounded-none sm:border-b-2 transition-colors ${
                  activeTab === 'generator'
                    ? 'bg-violet-600 sm:bg-transparent text-white sm:border-violet-500 sm:text-violet-400'
                    : 'text-slate-300 hover:text-white sm:border-transparent sm:hover:border-slate-300'
                }`}
              >
                Proposal Generator
              </button>
              <button
                onClick={() => {
                  setActiveTab('preview');
                  setIsMobileMenuOpen(false);
                }}
                disabled={!generatedProposal}
                className={`px-3 py-2 text-sm font-medium rounded-lg sm:rounded-none sm:border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-violet-600 sm:bg-transparent text-white sm:border-violet-500 sm:text-violet-400'
                    : generatedProposal
                    ? 'text-slate-300 hover:text-white sm:border-transparent sm:hover:border-slate-300'
                    : 'text-slate-500 cursor-not-allowed sm:border-transparent'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => {
                  setActiveTab('saved');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg sm:rounded-none sm:border-b-2 transition-colors ${
                  activeTab === 'saved'
                    ? 'bg-violet-600 sm:bg-transparent text-white sm:border-violet-500 sm:text-violet-400'
                    : 'text-slate-300 hover:text-white sm:border-transparent sm:hover:border-slate-300'
                }`}
              >
                Saved Proposals ({proposals.length})
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="xl:col-span-1">
              <ProposalForm onProposalGenerated={handleProposalGenerated} />
            </div>
            <div className="xl:col-span-1">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Be specific about your project scope to get more accurate proposals</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>AI recommendations help tailor content to industry best practices</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Review and customize the generated proposal before sending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && generatedProposal && (
          <div className="max-w-4xl mx-auto">
            <ProposalPreview 
              proposal={generatedProposal} 
              onSave={handleProposalSaved}
            />
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="w-full">
            <ProposalTable proposals={proposals} onProposalsUpdate={setProposals} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;