import { useState } from 'react';
import { Message } from './types';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';

export default function App() {
  const [apiKey, setApiKey] = useState(() =>
    import.meta.env.VITE_OPENROUTER_KEY ||
    localStorage.getItem('openrouter_key') ||
    ''
  );
  const [messages, setMessages] = useState<Message[]>([]);

  if (!apiKey) {
    return <ApiKeyModal onSubmit={key => setApiKey(key)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onResetKey={() => {
        localStorage.removeItem('openrouter_key');
        setApiKey('');
      }} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <ChatPanel
          messages={messages}
          setMessages={setMessages}
          apiKey={apiKey}
        />
      </main>
    </div>
  );
}
