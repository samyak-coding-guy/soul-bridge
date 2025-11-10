import React, { useState } from 'react';
import { Camera, Type, Sparkles, BookOpen, Heart, Zap, MessageCircle, Loader2, AlertCircle } from 'lucide-react';

export default function SoulBridge() {
  const [userText, setUserText] = useState('');
  const [bookContext, setBookContext] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [whisper, setWhisper] = useState(null);
  const [error, setError] = useState(null);

  const generateWhisper = async (passage, context) => {
    const apiUrl = '/api/generate-whisper';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passage, bookContext: context })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate whisper');
    }

    return await response.json();
  };

  const handleGetWhisper = async () => {
    if (!userText.trim()) return;
    setIsProcessing(true); setError(null); setWhisper(null);

    try {
      const result = await generateWhisper(userText, bookContext);
      setWhisper(result);
    } catch (err) {
      setError(err.message || "Kuch galat ho gaya. Please try again.");
      console.error(err);
    } finally { setIsProcessing(false); }
  };

  const clearAll = () => {
    setUserText(''); setBookContext(''); setWhisper(null); setError(null);
  };

  const samplePassages = [
    "You do not rise to the level of your goals. You fall to the level of your systems.",
    "Every action you take is a vote for the type of person you wish to become.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
  ];

  const useSamplePassage = (passage) => {
    setUserText(passage);
    setBookContext("Atomic Habits by James Clear");
  };

  // Function to highlight [bracketed] text
  const highlightBrackets = (text) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, idx) =>
      part.startsWith('[') && part.endsWith(']')
        ? <span key={idx} className="bg-yellow-100 text-yellow-900 px-1 rounded">{part.slice(1, -1)}</span>
        : part
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto py-6">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="text-rose-500" size={36} />
            <h1 className="text-3xl font-bold text-gray-800">Soul Bridge</h1>
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Your AI reading companion. Paste any confusing passage and
            understand what the author <span className="font-semibold italic">really meant</span> — in Hinglish.
          </p>
        </div>

        {/* BOOK CONTEXT INPUT */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-purple-500" />
            <label className="text-sm font-semibold text-gray-700">
              Book & Author <span className="text-gray-400 font-normal">(helps AI understand context)</span>
            </label>
          </div>
          <input
            type="text"
            placeholder="e.g., Atomic Habits by James Clear"
            value={bookContext}
            onChange={(e) => setBookContext(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>

        {/* PASSAGE INPUT */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Paste the confusing passage
          </label>
          <textarea
            placeholder="Copy and paste the sentence or paragraph you want to deeply understand..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            rows={6}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-gray-800"
          />
          <div className="mt-3 text-xs text-gray-500 mb-2">Try these examples:</div>
          <div className="flex flex-wrap gap-2">
            {samplePassages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => useSamplePassage(p)}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
              >
                Example {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 text-sm font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* GET WHISPER BUTTON */}
        {userText.trim() && !whisper && (
          <button
            onClick={handleGetWhisper}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} /> AI is reading & understanding...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Get the Soul Whisper
              </>
            )}
          </button>
        )}

        {/* DISPLAY WHISPER */}
        {whisper && (
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 shadow-xl border-l-4 border-rose-500 mb-4 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-rose-600" size={24} />
              <h3 className="text-rose-700 font-bold text-lg">The Soul Whisper</h3>
            </div>

            {bookContext && (
              <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 font-semibold mb-1">📖 FROM:</p>
                <p className="text-gray-700 text-sm font-medium">{bookContext}</p>
              </div>
            )}

            <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 font-semibold mb-1">📝 YOUR PASSAGE:</p>
              <p className="text-gray-700 text-sm italic">"{userText}"</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <p className="text-xs text-purple-700 font-bold mb-2">💡 WHAT IT REALLY MEANS:</p>
                <p className="text-gray-800 leading-relaxed">{highlightBrackets(whisper.interpretation)}</p>
              </div>

              <div className="bg-white bg-opacity-70 rounded-lg p-4">
                <p className="text-xs text-blue-700 font-bold mb-2">💭 EMOTIONAL CONTEXT:</p>
                <p className="text-gray-700 leading-relaxed text-sm">{highlightBrackets(whisper.emotion)}</p>
              </div>

              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4">
                <p className="text-xs text-amber-800 font-bold mb-2">🇮🇳 DESI CONNECTION:</p>
                <p className="text-amber-900 leading-relaxed text-sm">{highlightBrackets(whisper.culturalNote)}</p>
              </div>

              {whisper.wordMeanings && Object.keys(whisper.wordMeanings).length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-700 font-bold mb-2">📖 WORD MEANINGS:</p>
                  <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
                    {Object.entries(whisper.wordMeanings).map(([word, meaning]) => (
                      <li key={word}>
                        <strong>{word}</strong>: {highlightBrackets(meaning)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={clearAll}
              className="w-full mt-4 bg-white text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            >
              ✨ Ask About Another Passage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
