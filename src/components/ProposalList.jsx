import React, { useEffect, useState } from "react";
import ProposalForm from "./ProposalForm";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

export default function ProposalList({ propertyId, ownerId = null }) {
  const { fetchProposals, createProposal, voteProposal, closeProposal, user, isAuthenticated, holdings } = useWallet();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const userHoldings = holdings?.[propertyId] || 0;
  const isOwner = String(user?.id) === String(ownerId);

  const load = async () => {
    setLoading(true);
    const list = await fetchProposals(propertyId);
    setProposals(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleCreate = async (title, description, options) => {
    const proposal = await createProposal(propertyId, title, description, options);
    if (proposal) {
      setShowForm(false);
      load();
      return proposal;
    }
    return null;
  };

  const handleVote = async (proposalId, option) => {
    if (!isAuthenticated) {
      alert("Please sign in to vote.");
      return;
    }
    if ((userHoldings || 0) < 1) {
      alert("You must hold at least 1 token of this property to vote.");
      return;
    }
    const updated = await voteProposal(proposalId, option);
    if (updated) load();
  };

  const handleClose = async (proposalId) => {
    if (!window.confirm("Close this proposal? This will mark it as closed and freeze votes.")) return;
    const res = await closeProposal(proposalId);
    if (res) load();
  };

  return (
    <div className="mt-8 bg-[#0b0b0b] p-6 rounded-2xl border border-brand-gray">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Proposals</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            if (!isAuthenticated) return navigate('/login');
            if (!isOwner) return alert('Only the property owner can propose events.');
            setShowForm((s) => !s);
          }} className={`px-3 py-2 rounded ${isOwner ? 'bg-brand-green text-black' : 'bg-white/5 text-gray-400 cursor-not-allowed'}`}>Propose Event</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <ProposalForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="text-gray-400">No proposals yet. Be the first to propose an event for this property.</div>
      ) : (
        <ul className="space-y-4">
          {proposals.map((p) => {
            const tallies = p.options.map((opt) => {
              const voters = (p.votes || []).filter((v) => v.option === opt).map((v) => {
                const voter = v.voter;
                if (!voter) return String(v.voter || 'anonymous');
                if (typeof voter === 'string') return voter;
                return voter.username || voter.walletAddress || String(voter._id || 'anonymous');
              });
              return { option: opt, votes: voters.length, voters };
            });
            const userVote = (p.votes || []).find((v) => String(v.voter?._id || v.voter) === String(user?.id));
            return (
              <li key={p._id} className="p-4 bg-[#0b0b0b] border border-white/5 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{p.title}</div>
                    {p.description && <div className="text-sm text-gray-400">{p.description}</div>}
                    <div className="text-xs text-gray-400 mt-2">Proposed by: {p.proposer?.username || p.proposer?.walletAddress || 'anonymous'}</div>
                  </div>
                  <div className="text-sm text-gray-400">{new Date(p.createdAt).toLocaleString()}</div>
                </div>

                <div className="mt-3 grid gap-2">
                  {tallies.map((t) => (
                    <div key={t.option} className="flex flex-col gap-2">
                      <button onClick={() => handleVote(p._id, t.option)} disabled={p.status !== 'active' || (userHoldings || 0) < 1} className={`flex items-center justify-between px-3 py-2 rounded ${userVote?.option === t.option ? 'bg-brand-green text-black' : 'bg-white/5 text-white'} ${p.status !== 'active' ? 'opacity-60 cursor-not-allowed' : ''} ${(userHoldings || 0) < 1 ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <span>{t.option}</span>
                        <span className="text-sm text-gray-300">{t.votes}</span>
                      </button>

                      {t.voters && t.voters.length > 0 && (
                        <div className="text-xs text-gray-400 ml-2">Voters: {t.voters.join(', ')}</div>
                      )}
                    </div>
                  ))}

                  {/* Status / Result */}
                  <div className="mt-2 text-sm text-gray-400">
                    {p.status === 'active' ? (
                      (() => {
                        // leading option
                        const leading = tallies.reduce((a, b) => (b.votes > a.votes ? b : a), tallies[0] || { votes: 0 });
                        const ties = tallies.filter((x) => x.votes === leading.votes).map((x) => x.option);
                        if (leading.votes === 0) return <div>No votes yet</div>;
                        if (ties.length > 1) return <div>Leading (tie): {ties.join(', ')} — {leading.votes} votes</div>;
                        return <div>Leading: {leading.option} — {leading.votes} votes</div>;
                      })()
                    ) : (
                      (() => {
                        const top = tallies.reduce((a, b) => (b.votes > a.votes ? b : a), tallies[0] || { votes: 0 });
                        const winners = tallies.filter((x) => x.votes === top.votes).map((x) => x.option);
                        if (top.votes === 0) return <div>Closed — no votes</div>;
                        if (winners.length > 1) return <div>Closed — tie between: {winners.join(', ')} ({top.votes} votes)</div>;
                        return <div>Closed — Winner: {winners[0]} ({top.votes} votes)</div>;
                      })()
                    )}
                  </div>

                  {p.status === 'active' && String(p.proposer?._id || p.proposer) === String(user?.id) && (
                    <div className="mt-3">
                      <button onClick={() => handleClose(p._id)} className="px-3 py-2 bg-red-600 text-white rounded">Close Proposal</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
