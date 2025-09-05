import { View, Text, Alert, Button, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Calendar from 'expo-calendar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function Calendario() {
  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date(Date.now()+30*60* 1000));
  const [esSelectorFechaVisible, setSelectorFechaVisible] = useState(false);
  const [esSelectorFechaFinVisible, setSelectorFechaFinVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'no se pudo acceder al calendario')
      }
    })()
  },[])

  const manejarConfirmacionFechaInicio =(date:Date) => {
    setFechaInicio(date)
    setSelectorFechaVisible(false)
  };

  const manejarConfirmacionFechaFin =(date:Date) =>{
    setFechaFin(date)
    setSelectorFechaFinVisible(false);
  };

  const agregarEvento = async () => {
    if (!titulo) {
        Alert.alert('Titulo vacio', 'Por favor, introduce un titulo para el evento')
        return
    }
    try {
      const calendarios=await Calendar.getCalendarsAsync()
      const calendarioDefault=calendarios.find(cal=> cal.isPrimary)||calendarios[0]
      if (!calendarioDefault) {
        Alert.alert('Error', 'no se encontro un calendario disponible');
        return;
      }

      await Calendar.createEventAsync(calendarioDefault.id,{
        title: titulo,
        startDate: fechaInicio,
        endDate: fechaFin,
        location: ubicacion,
      })

      Alert.alert('Evento creado', 'el evento ha sido agregado al calendario')
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Ocurrio un problema creando el evento')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Crear un nuevo evento
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Titulo del evento"
        onChangeText={setTitulo}
        value={titulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Ubicacion"
        onChangeText={setUbicacion}
        value={ubicacion}
      />

      <View style={styles.datePickerContainer}>
        <Button title="Seleccionar fecha de inicio" onPress={() => setSelectorFechaVisible(true)} />
        <Text style={styles.dateText}>Inicio: {fechaInicio.toLocaleString()}</Text>
      </View>

      <View style={styles.datePickerContainer}>
        <Button title="Seleccionar fecha de fin" onPress={() => setSelectorFechaFinVisible(true)} />
        <Text style={styles.dateText}>Fin: {fechaFin.toLocaleString()}</Text>
      </View>

      <Button title="Agregar evento al calendario" onPress={agregarEvento} />

      <DateTimePickerModal
        isVisible={esSelectorFechaVisible}
        mode="datetime"
        onConfirm={manejarConfirmacionFechaInicio}
        onCancel={() => setSelectorFechaVisible(false)}
      />

      <DateTimePickerModal
        isVisible={esSelectorFechaFinVisible}
        mode="datetime"
        onConfirm={manejarConfirmacionFechaFin}
        onCancel={() => setSelectorFechaFinVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  dateText: {
    marginTop: 5,
    textAlign: 'center',
  },
});