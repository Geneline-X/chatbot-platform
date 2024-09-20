"use client"
import React, { ReactNode, createContext, useState, useRef, useEffect } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { getInMemoryMessages, getSession, isValidEmail, setSession, storeInMemoryMessage } from '../../lib/utils'

type StreamResponseType = {
    addMessage: () => void,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    message: string,
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading: boolean,
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>
}

export const ChatContex = createContext<StreamResponseType>({
    addMessage: () => {},
    message: "",
    setMessage: () => {},
    handleInputChange: () => {},
    isLoading: false,
    email: "",
    setEmail: () => { }
})

interface Props {
    chatbotId: string,
    children: ReactNode,
    chatContainerRef: React.RefObject<HTMLDivElement>
}

export const ChatContextProvider = ({ chatbotId, children, chatContainerRef }: Props) => {
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [sessionId, setSessionId] = useState<string | null>(null);

    const utils = trpc.useContext()
    const { toast } = useToast()

    const backupMessage = useRef("")
    const completeMessage = useRef<string>("")

    useEffect(() => {
        const existingSession = getSession();
        if (!existingSession) {
            const newSessionId = crypto.randomUUID();
            setSession(newSessionId);
            setSessionId(newSessionId);
        } else {
            setSessionId(existingSession);
        }
    }, []);

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch("/api/message", {
                method: "POST",
                body: JSON.stringify({
                    chatbotId,
                    message,
                    email,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to send message");
            }
            return response.body;
        },
        onMutate: async ({ message }) => {
            backupMessage.current = message;
            setMessage("");
    
            await utils.getChatbotMessages.cancel();
    
            // Get the current messages for the chat
            const previousMessages = utils.getChatbotMessages.getInfiniteData();
    
            // Optimistically update the UI
            utils.getChatbotMessages.setInfiniteData(
                { chatbotId, limit: INFINITE_QUERY_LIMIT, email },
                (old) => {
                    if (!old) {
                        return { pages: [], pageParams: [] };
                    }
            
                    let newPages = [...old.pages];
                    let latestPage = newPages[0]!;
            
                    // Add new message optimistically
                    const newMessage = {
                        createAt: new Date().toISOString(),
                        id: crypto.randomUUID(),
                        text: message,
                        chatbotId,
                        isUserMessage: true
                    };
                    
                    latestPage.messages = [
                        newMessage,
                        ...latestPage.messages
                    ];
            
                    newPages[0] = latestPage;
            
                    return { ...old, pages: newPages };
                }
            );
            
            // Scroll to bottom after optimistic update
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            }, 0);

            setIsLoading(true);
    
            return { previousMessages: previousMessages?.pages.flatMap((page) => page.messages) ?? [] };
        },
        onSuccess: async (stream) => {
            if (!stream) {
                return toast({
                    title: "There was a problem sending this message",
                    description: "Please refresh this page and try again",
                    variant: "destructive"
                });
            }
    
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accResponse = "";
    
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                accResponse += chunkValue;
    
                utils.getChatbotMessages.setInfiniteData(
                    { chatbotId, limit: INFINITE_QUERY_LIMIT, email },
                    (old: any) => {
                        if (!old) return { pages: [], pageParams: [] };
    
                        let isAiResponseCreated = old.pages.some((page: any) =>
                            page.messages.some((message: any) => message.id === 'ai-response')
                        );
    
                        let updatedPages = old.pages.map((page: any) => {
                            if (page === old.pages[0]) {
                                let updatedMessages;
                                if (!isAiResponseCreated) {
                                    updatedMessages = [
                                        {
                                            createAt: new Date().toISOString(),
                                            id: 'ai-response',
                                            text: accResponse,
                                            isUserMessage: false
                                        },
                                        ...page.messages
                                    ];
                                } else {
                                    updatedMessages = page.messages.map((message: any) => {
                                        if (message.id === 'ai-response') {
                                            return {
                                                ...message,
                                                text: accResponse
                                            };
                                        }
                                        return message;
                                    });
                                }
    
                                return { ...page, messages: updatedMessages };
                            }
                            return page;
                        });
                        return { ...old, pages: updatedPages };
                    }
                );

                // Scroll to bottom after each update
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            }
    
            setIsLoading(false);
        },
        onError: (_, __, context) => {
            setIsLoading(false);
            setMessage(backupMessage.current);
            utils.getChatbotMessages.setData(
                { chatbotId, email, sessionId },
                //@ts-ignore
                { messages: context?.previousMessages ?? [] }
            );
        },
        onSettled: async () => {
            setIsLoading(false);
            await utils.getChatbotMessages.invalidate({ chatbotId });
        }
    });
    

    const addMessage = () => {
        sendMessage({ message })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }

    return (
        <ChatContex.Provider value={{
            addMessage,
            message,
            handleInputChange,
            isLoading,
            setMessage,
            email,
            setEmail
        }}>
            {children}
        </ChatContex.Provider>
    )
}