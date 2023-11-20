import React, { useEffect } from 'react';
import mqtt from 'mqtt';

const MqttComponent = () => {
  const options = {
    connectTimeout: 4000,
    clientId: 'emqx',
    keepalive: 60,
    clean: true
  }
  const web_socketurl = "ws://18.222.142.225:8083/mqtt"

  useEffect(() => {
    // Cambia la URL del broker MQTT según tus necesidades
    
    const client = mqtt.connect(web_socketurl,options);

    // Evento de conexión
    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      // Suscribirse a un tema (topic)
      client.subscribe('mi/tema');
    });

    // Evento al recibir un mensaje
    client.on('message', (topic, message) => {
      console.log(`Mensaje recibido en el tema ${topic}: ${message.toString()}`);
      // Puedes manejar el mensaje como desees en tu aplicación React
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      console.log('Desconectando del broker MQTT');
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>Componente MQTT</h1>
      {/* Agrega tu contenido JSX aquí */}
    </div>
  );
};

export default MqttComponent;
