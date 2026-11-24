import React, { useState } from 'react';
import { Gamepad2, Trophy, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const QUESTIONS = [
  {
    q: 'Which spice gives traditional Kacchi Biryani its unmistakable golden hue and floral aroma?',
    options: ['Saffron (Zafran)', 'Paprika', 'Sumac', 'Fenugreek'],
    answer: 0,
    fact: 'Saffron threads steeped in warm milk infuse both golden color and delicate aroma into Kacchi Biryani.',
  },
  {
    q: 'What does the culinary term "blanching" mean?',
    options: [
      'Slow-cooking meat in oil',
      'Briefly boiling food then plunging it into ice water',
      'Baking bread without yeast',
      'Grating citrus zest finely',
    ],
    answer: 1,
    fact: 'Blanching locks in bright green color and crisp texture while halting enzymatic cooking.',
  },
  {
    q: 'Which oil is the signature flavor backbone of traditional Bengali Bhorta and Shorshe Ilish?',
    options: ['Olive Oil', 'Sesame Oil', 'Mustard Oil', 'Coconut Oil'],
    answer: 2,
    fact: 'Pungent kachi-ghani mustard oil gives Bengali cuisine its bold, distinctive warmth.',
  },
  {
    q: 'Roughly how many kilocalories are in 1 gram of dietary protein?',
    options: ['2 kcal', '4 kcal', '7 kcal', '9 kcal'],
    answer: 1,
    fact: 'Both protein and carbohydrates provide ~4 kcal/g, whereas fat provides ~9 kcal/g.',
  },
  {
    q: 'What is the Maillard reaction in cooking?',
    options: [
      'Fermentation of dough',
      'Browning between amino acids and sugars under heat',
      'Emulsification of egg yolk and oil',
      'Separation of whey from curds',
    ],
    answer: 1,
    fact: 'The Maillard reaction creates the rich crust on seared steaks, toasted bread, and roasted coffee.',
  },
  {
    q: 'Which herb belongs to the mint family and is essential to authentic Italian Pesto Genovese?',
    options: ['Cilantro', 'Sweet Basil', 'Tarragon', 'Dill'],
    answer: 1,
    fact: 'Sweet basil, pine nuts, garlic, Parmigiano-Reggiano, and olive oil make classic Pesto Genovese.',
  },
  {
    q: 'What is the traditional five-spice blend "Panch Phoron" made of?',
    options: [
      'Five whole seeds (fenugreek, nigella, cumin, black mustard, fennel)',
      'Five ground chilies',
      'Cinnamon, clove, nutmeg, mace, cardamom',
      'Garlic, ginger, turmeric, coriander, cumin',
    ],
    answer: 0,
    fact: 'Panch Phoron is always tempered whole in hot oil or ghee at the start or finish of a Bengali dish.',
  },
  {
    q: 'Which nutrient slows down blood-sugar spikes and improves gut health?',
    options: ['Sodium', 'Dietary Fiber', 'Refined Sugar', 'Trans Fat'],
    answer: 1,
    fact: 'Soluble fiber slows digestion and feeds beneficial gut microbiota.',
  },
];

export default function FoodTrivia() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[idx];

  const choose = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === current.answer) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setFinished(false);
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Interactive Kitchen Game</div>
          <h1 className="rb-title">Food Trivia Challenge</h1>
          <p className="rb-subtitle">
            Test your knowledge of spices, culinary science, Bengali classics, and nutrition.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="rb-badge rb-badge-gold">Score: {score}/{QUESTIONS.length}</span>
          <span className="rb-badge rb-badge-sage">Streak: {streak}</span>
        </div>
      </div>

      {finished ? (
        <div className="rb-card" style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto', padding: '2.75rem' }}>
          <Trophy size={48} color="var(--gold)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {score >= 6 ? 'Head Chef Status!' : score >= 4 ? 'Sous Chef Material!' : 'Keep Tasting & Learning!'}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            You scored <strong>{score}</strong> out of <strong>{QUESTIONS.length}</strong> ({Math.round((score / QUESTIONS.length) * 100)}%).
          </p>
          <button type="button" className="rb-btn rb-btn-primary" onClick={restart}>
            <RefreshCw size={15} /> Play Again
          </button>
        </div>
      ) : (
        <div className="rb-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="rb-badge rb-badge-accent">
              <Gamepad2 size={13} /> Question {idx + 1} of {QUESTIONS.length}
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>{current.q}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.25rem' }}>
            {current.options.map((opt, oi) => {
              const isChosen = selected === oi;
              const isCorrect = oi === current.answer;
              let bg = 'var(--surface-soft)';
              let border = 'var(--border-strong)';
              if (selected !== null) {
                if (isCorrect) {
                  bg = 'var(--sage-soft)';
                  border = 'var(--sage)';
                } else if (isChosen) {
                  bg = 'var(--danger-soft)';
                  border = 'var(--danger)';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => choose(oi)}
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${border}`,
                    background: bg,
                    textAlign: 'left',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{opt}</span>
                  {selected !== null && isCorrect && <CheckCircle2 size={18} color="var(--sage)" />}
                  {selected !== null && isChosen && !isCorrect && <XCircle size={18} color="var(--danger)" />}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--gold-soft)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <strong>Chef’s Note:</strong> {current.fact}
            </div>
          )}

          {selected !== null && (
            <button type="button" className="rb-btn rb-btn-primary" onClick={next}>
              {idx + 1 >= QUESTIONS.length ? 'See Final Score' : 'Next Question →'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
