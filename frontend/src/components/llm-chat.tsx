import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Eraser, Send, User, XIcon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define the Message interface with strict role typing
interface Message {
  role: "user" | "assistant";
  content: string;
}

export function LlmChat({ locationName }: { locationName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAX_MESSAGES = 10;

  const handleSendMessage = async (newMessage: string) => {
    const locationPrompt = `I am in the location: ${locationName}`;
    const userMessage: Message = { role: "user", content: newMessage };
    const updatedMessages = [...messages, userMessage];

    const truncatedMessages = updatedMessages.slice(-MAX_MESSAGES);
    setMessages(truncatedMessages);
    setInput("");

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://nasaspaceapps.aryanranderiya1478.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a friendly assistant" },
              { role: "user", content: locationPrompt },
              ...truncatedMessages,
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from LLM");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response, // Use data.response directly
      };

      const updatedWithAssistant = [...truncatedMessages, assistantMessage];
      setMessages(updatedWithAssistant);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input.trim());
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 shadow-xl right-6 bg-blue-500 border-[3px] border-solid border-white rounded-full w-12 h-12 p-0 cursor-pointer z-20"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-background border-l shadow-lg flex flex-col z-50"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <div className="w-full justify-between flex-row flex">
                  <h2 className="text-lg font-semibold">Need help?</h2>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="p-0 bg-transparent"
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon className="w-4 h-4" color="#000000" />
                  </Button>
                </div>
                <h2 className="text-xs space-x-[2px]">
                  <span>Talk to</span>
                  <span className="font-semibold">AgriBot</span>
                  <span>
                    , your virtual farming assistant for all your agricultural
                    questions!
                  </span>
                </h2>
              </div>
            </div>

            <ScrollArea className="flex-grow p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Bot className="w-8 h-8 rounded-full bg-primary text-primary-foreground p-1 mr-2 flex-shrink-0" />
                  )}
                  <div
                    className={`rounded-lg p-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </Markdown>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === "user" && (
                    <User className="w-8 h-8 rounded-full bg-primary text-primary-foreground p-1 ml-2 flex-shrink-0" />
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
            </ScrollArea>

            <div className="px-4 pb-4 pt-2 border-t flex flex-col items-end gap-2">
              <div
                className={`bg-transparent text-xs font-bold flex gap-1 items-center select-none ${
                  messages.length > 0
                    ? "text-foreground cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (messages.length > 0) setMessages([]);
                }}
              >
                <span>Clear Chat</span>
                <Eraser width={15} />
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex items-center w-full"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow mr-2"
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="min-w-4 min-h-4" color="#ffffff" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
