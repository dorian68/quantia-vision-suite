
import { useState } from 'react';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour, je suis votre assistant OptiQuantIA. Comment puis-je vous aider aujourd'hui?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Simulate assistant response (in a real app, this would be an API call)
    setTimeout(() => {
      // Mock responses based on input keywords
      let responseText = "Je n'ai pas bien compris. Pouvez-vous reformuler votre question?";
      
      if (input.toLowerCase().includes('performance')) {
        responseText = "Le module de pilotage de la performance vous permet de suivre vos KPIs essentiels et d'anticiper les écarts. Voulez-vous que je vous montre le tableau de bord principal?";
      } else if (input.toLowerCase().includes('prédictif') || input.toLowerCase().includes('predictif')) {
        responseText = "Notre intelligence prédictive analyse vos données historiques pour projeter votre trésorerie et optimiser votre supply chain. Je peux vous montrer des exemples de prévisions si vous le souhaitez.";
      } else if (input.toLowerCase().includes('rapport') || input.toLowerCase().includes('generer')) {
        responseText = "Je peux générer un rapport personnalisé pour vous. Quel type d'analyse souhaitez-vous inclure?";
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseText,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Floating button when chat is closed */}
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-quantia-blue to-quantia-purple hover:from-quantia-purple hover:to-quantia-blue transition-all duration-300"
          size="icon"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-300",
            isExpanded
              ? "bottom-4 right-4 left-4 top-20 md:left-auto md:right-4 md:bottom-4 md:top-20 md:w-[600px]"
              : "bottom-4 right-4 w-80 h-96 md:w-96 md:h-[500px]"
          )}
        >
          {/* Header */}
          <div className="bg-primary p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Assistant IA</h3>
                <p className="text-xs text-white/70">OptiQuantIA</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                className="w-7 h-7 p-0 text-white/80 hover:text-white hover:bg-white/10" 
                onClick={toggleExpand}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                className="w-7 h-7 p-0 text-white/80 hover:text-white hover:bg-white/10" 
                onClick={toggleOpen}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-3 overflow-y-auto h-[calc(100%-108px)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "mb-3 max-w-[85%] p-3 rounded-lg",
                  message.sender === 'user'
                    ? "bg-muted ml-auto rounded-tr-none"
                    : "bg-primary/10 mr-auto rounded-tl-none"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-muted/20">
            <div className="flex items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez une question..."
                className="min-h-0 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                variant="default"
                size="icon"
                className="flex-shrink-0 bg-primary"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
