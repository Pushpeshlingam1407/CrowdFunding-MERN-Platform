import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  User, 
  Search, 
  MoreVertical, 
  FileIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid, Input } from '../components/ui';
import { chatAPI, b2bAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const ChatWrapper = styled.div`
  height: calc(100vh - 80px);
  background: #fafafa;
  overflow: hidden;
`;

const ChatGrid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100%;
  border-right: 1px solid #f0f0f0;
`;

const Sidebar = styled.div`
  background: white;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ContactList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  background: ${props => props.active ? '#0077b60a' : 'transparent'};
  border-right: ${props => props.active ? `3px solid ${props.theme.colors.primary}` : 'none'};
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
`;

const MainChat = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const ChatHeader = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MessagesArea = styled.div`
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fafafa;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  ${props => props.own ? `
    align-self: flex-end;
    background: ${props.theme.colors.primary};
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background: white;
    color: #333;
    border-bottom-left-radius: 4px;
  `}
`;

const ChatInput = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PrivateSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) {
       fetchChatDetails();
    }
  }, [id]);

  const fetchChatDetails = async () => {
    try {
      const contactRes = await b2bAPI.getCompany(id);
      setActiveContact(contactRes.data.user);
      const msgRes = await chatAPI.getMessages(id);
      setMessages(msgRes.data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !id) return;

    try {
      const res = await chatAPI.sendMessage({ receiverId: id, text: inputText });
      setMessages([...messages, res.data.message]);
      setInputText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <ChatWrapper>
      <ChatGrid>
        <Sidebar>
          <SidebarHeader>
            <Flex justify="space-between" style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Private Space</h2>
            </Flex>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <Input style={{ paddingLeft: '2.5rem', background: '#f8f9fa' }} placeholder="Search Professional..." />
            </div>
          </SidebarHeader>
          <ContactList>
             {/* Dynamic contacts will go here */}
             {activeContact && (
               <ContactItem active>
                  <Avatar>{activeContact.name.charAt(0)}</Avatar>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeContact.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Professional Service</p>
                  </div>
               </ContactItem>
             )}
          </ContactList>
        </Sidebar>

        <MainChat>
          {activeContact ? (
            <>
              <ChatHeader>
                <Flex gap="1rem">
                   <Avatar>{activeContact.name.charAt(0)}</Avatar>
                   <div>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeContact.name}</h4>
                     <Flex gap="0.5rem" style={{ fontSize: '0.8rem', color: '#2f855a', fontWeight: 600 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2f855a' }} />
                        Active Professional
                     </Flex>
                   </div>
                </Flex>
                <Flex gap="1.5rem">
                   <ShieldCheck size={20} style={{ color: '#0077b6' }} />
                   <MoreVertical size={20} style={{ color: '#999', cursor: 'pointer' }} />
                </Flex>
              </ChatHeader>

              <MessagesArea>
                {messages.map(msg => (
                  <MessageBubble key={msg._id} own={msg.sender._id === user?.id}>
                    {msg.text}
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </MessagesArea>

              <ChatInput>
                <Button variant="outline" style={{ borderRadius: '12px', padding: '0.75rem' }}>
                   <Paperclip size={20} />
                </Button>
                <Input 
                  placeholder="Type a message to collaborate..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                  style={{ borderRadius: '12px' }}
                />
                <Button onClick={handleSend} style={{ borderRadius: '12px', padding: '0.75rem 1.5rem' }}>
                   <Send size={20} />
                </Button>
              </ChatInput>
            </>
          ) : (
            <Flex direction="column" style={{ height: '100%', color: '#999' }}>
               <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
               <p>Select a contact to start collaborating in your private space.</p>
            </Flex>
          )}
        </MainChat>
      </ChatGrid>
    </ChatWrapper>
  );
};

export default PrivateSpace;
