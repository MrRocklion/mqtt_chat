import { useEffect,useState } from 'react';
import './App.css';
import mqtt from "mqtt";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
function App() {


  
  const web_socketurl = "ws://18.222.142.225:8083/mqtt"


  const [client, setClient] = useState(null);
  const [connectStatus,setConnectStatus] = useState("Desconectado");
  const [message,setMessage] = useState("");
  const [id,setId] = useState(uuidv4());
  const [mensajes,setMensajes] = useState([]);
  const mqttConnect = () => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(web_socketurl, options));

  };
  const options = {
    connectTimeout: 4000,
    clientId: id,
    keepalive: 60,
    clean: true
  }
  const mqttPublish = () => {
    if (client) {
      let aux_mensajes = JSON.parse(JSON.stringify(mensajes))
      let mensaje = {
        text:message,
        id:id
      }
      let data_send = JSON.stringify(mensaje);
      client.publish("testtopic/2", data_send, error => {
        if (error) {
          console.log('Publish error: ', error);
        }
        setMessage("");
        aux_mensajes.push(mensaje)
          setMensajes(aux_mensajes)
      });
    }
  }
  useEffect(() => {
    //mqttConnect(web_socketurl,options)
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connected');
        client.subscribe("testtopic/2")
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log("el topico es: "+topic + "y el mensaje es "+message.toString());
        let aux_mensajes = JSON.parse(JSON.stringify(mensajes))
        aux_mensajes.push(JSON.parse(message))
        setMensajes(aux_mensajes)
        
      });
    }
  }, [client]);
  

  return (
    <div className="App">
      <header className="App-header">

        <Container maxWidth="sm">
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <h4>Chat-Live mediante Web Sockets v0.1</h4>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} spacing={2}>
            <h6  style={connectStatus === "Connected" ? {color:"#82E0AA"}:{color:"#F1948A"}}>{connectStatus}</h6>
            <Button variant="contained"  color='secondary' sx={{ height: "100%" }} onClick={mqttConnect}>Conectar</Button>
            </Stack>
          
           
          </Grid>

            <Grid item xs={12}>
       
              <div className='chat-body'>
              
                      {mensajes.map((item,index)=>(
                        <div  key={index} style={item.id === id ? {display:"flex",justifyContent:"end"}:{display:"flex",justifyContent:"start"}}>                 
                          <div className={item.id === id ? "msg-receive":"msg-send"} >{item.text}</div>
                          </div>
                      ))}
                 
              </div>
  
              
            </Grid>
            <Grid item xs={8}>
            <InputBase
            sx={{flex: 1 }}
            placeholder="Escribeme algo oe.."
            fullWidth
            inputProps={{ 'aria-label': 'Escribeme algo oe..', style: { color: "white",backgroundColor:'#5D6D7E',borderRadius:20,padding:10 } }}
            onChange={(event)=>{setMessage(event.target.value)}}
            value={message}

      />
            </Grid>
            <Grid item xs={4}>
              <Button disabled={connectStatus === "Connected" ? false:true} variant="contained" fullWidth sx={{ height: "100%" }} onClick={mqttPublish}>enviar</Button>
            </Grid>
          </Grid>
        </Container>
      </header>
    </div>
  );
}

export default App;
