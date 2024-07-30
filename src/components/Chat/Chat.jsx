import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const websocket = useRef(null);

  useEffect(() => {
    
    // Conectar al WebSocket cuando el componente se monta
    websocket.current = new WebSocket('ws://localhost:8080');

    websocket.current.onopen = () => {
      console.log('Conectado al servidor');
      setIsConnected(true);
    };

    websocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    websocket.current.onclose = () => {
      console.log('Desconectado del servidor');
      setIsConnected(false);
    };

    // Cerrar la conexión cuando el componente se desmonta
    return () => {
      websocket.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage && username) {
      const message = {
        username,
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      websocket.current.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {(new Date(msg.timestamp)).toLocaleTimeString()} <strong>{msg.username}:</strong>
            <p className='chat-bubble'>{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu nombre"
          className="username-input"
        />
        <div className='chat-message-section'>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="message-input"
          />
          <button type="submit" disabled={!isConnected} className='chat-submit'>
            Enviar
          </button>
        </div>
        
        </form>
    </div>
  );
};

export default ChatApp;