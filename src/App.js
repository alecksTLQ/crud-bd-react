import {React, useEffect,useState} from 'react'
import './App.css';
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core'
import {Edit, Delete} from '@material-ui/icons'


const baseUrl='https://localhost:44364/api/generos'

const useStyles = makeStyles((theme)=>({
  modal:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  },
  inputMaterial:{
    width: '100%'
  }
}))


function App() {

  const styles = useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [generoSeleccionado, setGeneroSeleccionado]=useState({
    nombre: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setGeneroSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(generoSeleccionado);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    })
  }

  const peticionPost=async()=>{
    console.log(generoSeleccionado)
    await axios.post(baseUrl, generoSeleccionado)
    .then(response=>{
      console.log(response)
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const seleccionarGenero=(consola, caso)=>{
    setGeneroSeleccionado(consola);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }


  useEffect(async()=>{
    await peticionGet();
  },[])


  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo genero</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  return (
    <div className="App">
      <Button onClick={()=> abrirCerrarModalInsertar()}> Insertar </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>Id</TableCell>
            <TableCell>Genero</TableCell>
            <TableCell>Acciones</TableCell>
          </TableHead>

          <TableBody>
            {
              data.map(genero=>(
                <TableRow key={genero.id}>
                  <TableCell> {genero.id} </TableCell>
                  <TableCell> {genero.nombre} </TableCell>
                  <TableCell>
                 <Edit className={styles.iconos} onClick={()=>seleccionarGenero(genero, 'Editar')}/>
                 &nbsp;&nbsp;&nbsp;
                 <Delete  className={styles.iconos} onClick={()=>seleccionarGenero(genero, 'Eliminar')}/>
                 </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>



      <Modal
      open={modalInsertar}
      onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
      </Modal>
    </div>
  );
}

export default App;
