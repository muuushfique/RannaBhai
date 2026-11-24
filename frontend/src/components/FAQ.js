import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIdx, setOpenIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/faqs')
      .then((res) => setFaqs(res.data || []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Help Center</div>
          <h1 className="rb-title">Frequently Asked Questions</h1>
          <p className="rb-subtitle">Quick answers about recipes, meal planning, nutrition, and accounts.</p>
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="rb-empty">No FAQs published yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '820px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={faq._id} className="rb-card" style={{ padding: '1.15rem 1.35rem' }}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', gap: '1rem' }}
                >
                  <strong style={{ fontSize: '1.05rem' }}>{faq.question}</strong>
                  {isOpen ? <ChevronUp size={18} color="var(--accent)" /> : <ChevronDown size={18} color="var(--muted)" />}
                </button>
                {isOpen && (
                  <p style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.94rem' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
