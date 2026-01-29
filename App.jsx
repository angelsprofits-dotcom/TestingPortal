import React, { useState } from 'react';
import { 
  LayoutDashboard, LogOut, Plus, Search, 
  ExternalLink, Edit3, Copy, Trash2, X, Upload, ChevronLeft, ChevronRight 
} from 'lucide-react';

const INITIAL_PROPOSALS = [
  { id: 1, client: 'John Doe', title: 'Exclusive Proposal', date: 'Jan 24, 2026', status: 'Active', yachts: [] },
  { id: 2, client: 'AG', title: 'Monaco', date: 'Jan 24, 2026', status: 'Active', yachts: [] },
];

export default function YachtPortal() {
  const [view, setView] = useState('dashboard');
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [activeProposal, setActiveProposal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddYachtOpen, setIsAddYachtOpen] = useState(false);

  const deleteProposal = (id) => {
    setProposals(proposals.filter(p => p.id !== id));
  };

  const addYachtToProposal = (yachtData) => {
    const updated = proposals.map(p => {
      if (p.id === activeProposal.id) {
        return { 
          ...p, 
          yachts: [...p.yachts, { 
            ...yachtData, 
            id: Date.now(),
            photos: yachtData.photos || []
          }] 
        };
      }
      return p;
    });
    setProposals(updated);
    setActiveProposal(updated.find(p => p.id === activeProposal.id));
    setIsAddYachtOpen(false);
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      {view !== 'public' && (
        <aside className="w-64 border-r border-gray-200 flex flex-col p-8 bg-slate-50">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white text-xl">
              ⚓
            </div>
            <span className="text-xl font-light tracking-wider text-slate-900">ARISTON</span>
          </div>
          
          <nav className="flex-1 space-y-1">
            <button 
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                view === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
          </nav>

          <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 transition text-sm">
            <LogOut size={18} /> Sign Out
          </button>
        </aside>
      )}

      <main className={`flex-1 overflow-auto ${view !== 'public' ? 'bg-white' : 'bg-gray-50'}`}>
        {view === 'dashboard' && (
          <Dashboard 
            proposals={proposals} 
            onDelete={deleteProposal}
            onManage={(p) => { setActiveProposal(p); setView('manage'); }}
            onViewPublic={(p) => { setActiveProposal(p); setView('public'); }}
            onCreateOpen={() => setIsCreateModalOpen(true)}
          />
        )}

        {view === 'manage' && (
          <ManageProposal 
            proposal={activeProposal} 
            onBack={() => setView('dashboard')}
            onAddYacht={() => setIsAddYachtOpen(true)}
          />
        )}

        {view === 'public' && (
          <PublicFleetView proposal={activeProposal} onBack={() => setView('dashboard')} />
        )}
      </main>

      {isCreateModalOpen && (
        <CreateProposalModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(newProposal) => {
            setProposals([...proposals, { 
              ...newProposal, 
              id: Date.now(), 
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              yachts: [] 
            }]);
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {isAddYachtOpen && (
        <Modal title={`Add Yacht to ${activeProposal.client}'s Proposal`} onClose={() => setIsAddYachtOpen(false)}>
           <YachtForm onSubmit={addYachtToProposal} />
        </Modal>
      )}
    </div>
  );
}

function Dashboard({ proposals, onDelete, onManage, onViewPublic, onCreateOpen }) {
  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-light mb-2 text-gray-900">YOUR PORTAL</h1>
          <p className="text-gray-500 font-light">Welcome back, <span className="font-medium">angelsprofits</span>. Your next voyage begins here.</p>
        </div>
        <button 
          onClick={onCreateOpen}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} /> New Concierge Request
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Active Requests</div>
          <div className="text-3xl font-light">{proposals.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Upcoming Trips</div>
          <div className="text-3xl font-light">0</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Fleet Access</div>
          <div className="text-3xl font-light">Unlimited</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Special Offers</div>
          <div className="text-3xl font-light">12 Available</div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-4 text-left text-xs uppercase tracking-wider text-gray-500 font-medium">Client</th>
            <th className="pb-4 text-left text-xs uppercase tracking-wider text-gray-500 font-medium">Title</th>
            <th className="pb-4 text-left text-xs uppercase tracking-wider text-gray-500 font-medium">Created</th>
            <th className="pb-4 text-left text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
            <th className="pb-4 text-right text-xs uppercase tracking-wider text-gray-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {proposals.map(p => (
            <tr key={p.id} className="group hover:bg-gray-50 transition">
              <td className="py-5 font-medium text-gray-900">{p.client}</td>
              <td className="py-5 text-gray-600">{p.title}</td>
              <td className="py-5 text-gray-500 text-sm">{p.date}</td>
              <td className="py-5">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Active</span>
              </td>
              <td className="py-5 text-right space-x-3">
                <button onClick={() => onViewPublic(p)} className="text-gray-400 hover:text-blue-600 transition">
                  <ExternalLink size={18}/>
                </button>
                <button onClick={() => onManage(p)} className="text-gray-400 hover:text-gray-900 transition">
                  <Edit3 size={18}/>
                </button>
                <button onClick={() => onDelete(p.id)} className="text-gray-400 hover:text-red-600 transition">
                  <Trash2 size={18}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ManageProposal({ proposal, onBack, onAddYacht }) {
  return (
    <div className="p-12 max-w-7xl mx-auto">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-900 mb-8 flex items-center gap-2 text-sm">
        ← Back to Dashboard
      </button>
      
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-light mb-2">{proposal.title}</h1>
          <p className="text-gray-500">Client: {proposal.client}</p>
        </div>
        <button 
          onClick={onAddYacht}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Add Yacht
        </button>
      </div>

      {proposal.yachts.length === 0 ? (
        <div className="text-center py-32 text-gray-400">
          <p className="text-xl mb-4">No yachts added yet</p>
          <p className="text-sm">Click "Add Yacht" to start building this proposal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {proposal.yachts.map(yacht => {
            const price = parseFloat(yacht.price) || 0;
            const vatPercent = parseFloat(yacht.vatPercent) || 0;
            const apaPercent = parseFloat(yacht.apaPercent) || 0;
            const vatAmount = (price * vatPercent) / 100;
            const apaAmount = (price * apaPercent) / 100;

            return (
              <div key={yacht.id} className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition">
                <div className="flex gap-6">
                  {yacht.photos && yacht.photos.length > 0 && (
                    <div className="w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={yacht.photos[0]} 
                        alt={yacht.name} 
                        className="w-full h-full object-cover"
                      />
                      {yacht.photos.length > 1 && (
                        <p className="text-xs text-gray-400 mt-2">+{yacht.photos.length - 1} more photos</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-light mb-1">{yacht.name}</h3>
                        <p className="text-sm text-gray-500">{yacht.model}</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          yacht.status === 'Available' ? 'bg-white border border-gray-900 text-gray-900' :
                          yacht.status === 'To Be Confirmed' ? 'bg-red-600 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {yacht.status?.toUpperCase()}
                        </span>
                        <button className="text-gray-400 hover:text-gray-900"><Edit3 size={18}/></button>
                        <button className="text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Approx Total</p>
                        <p className="text-xl font-light">€{price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">VAT {vatPercent}%</p>
                        <p className="text-gray-600">€{vatAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">APA {apaPercent}%</p>
                        <p className="text-gray-600">€{apaAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-6 text-sm text-gray-600 mb-4">
                      <p>📍 {yacht.location || 'N/A'}</p>
                      <p>📏 {yacht.length ? `${yacht.length}m` : 'N/A'}</p>
                      {(yacht.availableFrom || yacht.availableTo) && (
                        <p>
                          📅 {yacht.availableFrom && new Date(yacht.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {yacht.availableFrom && yacht.availableTo && ' - '}
                          {yacht.availableTo && new Date(yacht.availableTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    
                    {yacht.note && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Note</p>
                        <p className="italic text-gray-700 text-sm">{yacht.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PublicFleetView({ proposal, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-32 px-8 text-center border-b border-gray-200">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">WELCOME {proposal.client.toUpperCase()} | GRAND PRIX DE MONACO</p>
        <h1 className="text-8xl font-serif mb-6" style={{fontFamily: 'Playfair Display, Georgia, serif'}}>
          Monaco F1 <span className="italic font-light">2026</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
          An exclusive selection of superyachts for the ultimate race weekend experience.
        </p>
        <div className="mt-12">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Scroll</p>
          <div className="w-px h-12 bg-gray-300 mx-auto"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-light mb-2" style={{fontFamily: 'Playfair Display, Georgia, serif'}}>Fleet Selection</h2>
            <p className="text-gray-500 font-light">Confirmed availability for race weekend</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="border border-gray-300 px-6 py-2 rounded-lg text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white hover:border-gray-900 transition">
              ☰ Price: High to Low
            </button>
            <p className="text-gray-400 text-sm">{proposal.yachts.length} YACHTS AVAILABLE</p>
          </div>
        </div>
        
        {proposal.yachts.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <p className="text-xl mb-4">No yachts in this proposal yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {proposal.yachts.map(y => (
              <YachtCard key={y.id} yacht={y} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function YachtCard({ yacht }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = yacht.photos && yacht.photos.length > 0 
    ? yacht.photos 
    : ["https://via.placeholder.com/800x450/1e293b/cbd5e1?text=Luxury+Yacht"];

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  const price = parseFloat(yacht.price) || 0;
  const vatPercent = parseFloat(yacht.vatPercent) || 0;
  const apaPercent = parseFloat(yacht.apaPercent) || 0;
  const vatAmount = (price * vatPercent) / 100;
  const apaAmount = (price * apaPercent) / 100;

  const getStatusStyle = (status) => {
    if (status === 'Available') return 'bg-white border border-gray-900 text-gray-900';
    if (status === 'To Be Confirmed') return 'bg-red-600 text-white';
    return 'bg-blue-500 text-white';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[16/9] bg-gray-900 group">
        <div className={`absolute top-4 left-4 ${getStatusStyle(yacht.status)} px-3 py-1 text-[10px] font-bold uppercase tracking-wider z-10`}>
          {yacht.status?.toUpperCase() || 'CONFIRMED'}
        </div>
        
        <img 
          src={photos[currentPhotoIndex]} 
          alt={`${yacht.name} - Photo ${currentPhotoIndex + 1}`} 
          className="object-cover w-full h-full"
        />
        
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <ChevronRight size={20} className="text-gray-900" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button className="bg-white px-6 py-3 rounded-lg text-sm uppercase tracking-wider font-medium hover:bg-gray-100 transition flex items-center gap-2">
            View Brochure <ExternalLink size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
          <h3 className="text-3xl font-light uppercase tracking-wide" style={{fontFamily: 'Playfair Display, Georgia, serif'}}>
            {yacht.name}
          </h3>
          <span className="text-gray-500 text-sm">{yacht.length ? `${yacht.length}m` : '85.7m'}</span>
        </div>
        
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-6">
          📍 {yacht.location || 'France'}
        </p>

        {yacht.note && (
          <div className="mb-6 bg-gray-50 p-4 rounded">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Note</p>
            <p className="text-gray-700 italic text-sm">{yacht.note}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-wider text-gray-400">Approx Total</p>
            <p className="text-2xl font-light">€{price.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">VAT {vatPercent}%</p>
            <p className="text-gray-700">€{vatAmount.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">APA {apaPercent}%</p>
            <p className="text-gray-700">€{apaAmount.toLocaleString()}</p>
          </div>
          
          {(yacht.availableFrom || yacht.availableTo) && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Availability</p>
              <p className="text-sm text-gray-600">
                {yacht.availableFrom && formatDate(yacht.availableFrom)}
                {yacht.availableFrom && yacht.availableTo && ' - '}
                {yacht.availableTo && formatDate(yacht.availableTo)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Confirmed Price</p>
          <p className="text-2xl font-light">€{(price - (price * 0.05)).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function CreateProposalModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ client: '', title: '', status: 'Active' });
  
  const handleSubmit = () => {
    if (form.client && form.title) {
      onSubmit(form);
    }
  };
  
  return (
    <Modal title="New Proposal" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Client Name</label>
          <input 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="John Doe"
            value={form.client}
            onChange={e => setForm({...form, client: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Proposal Title</label>
          <input 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="Monaco Grand Prix 2026"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Status</label>
          <select 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition"
            value={form.status}
            onChange={e => setForm({...form, status: e.target.value})}
          >
            <option>Draft</option>
            <option>Active</option>
          </select>
        </div>
        <button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition mt-6"
        >
          Create Proposal
        </button>
      </div>
    </Modal>
  );
}

function YachtForm({ onSubmit }) {
  const [form, setForm] = useState({ 
    name: '', model: '', price: '', length: '', location: '', note: '',
    vatPercent: '20', apaPercent: '40', availableFrom: '', availableTo: '',
    status: 'Available', photos: []
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(photoPromises).then(photos => {
      setForm({...form, photos: [...form.photos, ...photos]});
    });
  };

  const removePhoto = (index) => {
    setForm({...form, photos: form.photos.filter((_, i) => i !== index)});
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Vessel Name</label>
          <input 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="HBC" 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Model/Builder</label>
          <input 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="Benetti" 
            value={form.model}
            onChange={e => setForm({...form, model: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Charter Price (€)</label>
          <input 
            type="number"
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="1680000" 
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Length (m)</label>
          <input 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="85.7" 
            value={form.length}
            onChange={e => setForm({...form, length: e.target.value})} 
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Location</label>
          <input 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="Caribbean" 
            value={form.location}
            onChange={e => setForm({...form, location: e.target.value})} 
          />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Available From</label>
          <input 
            type="date"
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            value={form.availableFrom}
            onChange={e => setForm({...form, availableFrom: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Available To</label>
          <input 
            type="date"
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            value={form.availableTo}
            onChange={e => setForm({...form, availableTo: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">VAT %</label>
          <input 
            type="number"
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="20" 
            value={form.vatPercent}
            onChange={e => setForm({...form, vatPercent: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">APA %</label>
          <input 
            type="number"
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="40" 
            value={form.apaPercent}
            onChange={e => setForm({...form, apaPercent: e.target.value})} 
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Status</label>
          <select 
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:outline-none transition"
            value={form.status}
            onChange={e => setForm({...form, status: e.target.value})}
          >
            <option>Available</option>
            <option>To Be Confirmed</option>
            <option>Not Available</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Client Note</label>
          <textarea 
            className="w-full border border-gray-200 rounded-lg p-3 h-24 text-gray-900 focus:border-blue-500 focus:outline-none transition" 
            placeholder="Cap 120 (but there is no way it cannot do a lot more, same for some other room to negotiate that)" 
            value={form.note}
            onChange={e => setForm({...form, note: e.target.value})} 
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Yacht Photos</label>
        <input 
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition"
        />
        {form.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {form.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img src={photo} alt={`Yacht ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={() => onSubmit(form)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Add to Proposal
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <h2 className="text-2xl font-light text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24}/>
          </button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
