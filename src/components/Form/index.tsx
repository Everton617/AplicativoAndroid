import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { prismaClient } from "../../services/db"
import { Image } from 'react-native';

export function FormTask() {
  const [produto, setProduto] = useState("")
  const [quantidade, setQuantidade] = useState(0)
  const [preco, setPreco] = useState(0)
  const [modalVisible, setModalVisible] = useState(false);

  async function handleNewTask() {
    if (produto === "" || quantidade === 0 || preco === 0 || preco === undefined || isNaN(preco)) return;

    console.log('Adicionando')

    await prismaClient.estoque.create({
      data: {
        nome: produto,
        disponivel: true,
        quantidade: quantidade,
        preco: preco,

      }
    })

    setModalVisible(false)

    setProduto("")
    setQuantidade(0)
    setPreco(0)
    Keyboard.dismiss()

  }

  return (
    <View style={styles.container}>
      <View style={styles.container} >
      <Image style ={styles.logo} source={require('../../../assets/logotipo.png')} />

        <Pressable style={styles.buttonAdd} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
          <Ionicons name="add" size={24} color="#FFF" />
        </Pressable>

      </View>

      <Modal
        animationType="slide" // ou 'fade' ou 'none'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible); // Garante que o modal fecha ao tocar fora (Android)
        }}
      >

        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <View style={styles.header} >
              <Text style={styles.title}>Adicionar novo Produto</Text>
              <AntDesign style={{ marginTop: 5 }} name="shoppingcart" size={24} color="black" />
            </View>
            <TextInput
              placeholder="Digite um produto..."
              value={produto}
              onChangeText={setProduto}
              style={styles.input}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Digite a quantidade..."
              value={quantidade.toString()}
              onChangeText={text => setQuantidade(Number(text))}
              style={styles.input}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Digite o preço..."
              value={preco.toString()}
              onChangeText={text => setPreco(Number(text))}
              style={styles.input}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.button, styles.buttonSave]} onPress={handleNewTask}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',

  },
  title: {
    fontSize: 24,
    color: '#333',
    paddingBottom: 20
  },
  logo:{
    width: 250,
    height: 200,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    marginRight: 5,
  },
  buttonAdd: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#582766', 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width:170
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
  },
  modalButtonContainer: { // Estilos para o container dos botões
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  buttonSave: {
    backgroundColor: 'green',
    width: '40%'
  },
  buttonCancel: {
    backgroundColor: 'red',
    width: '40%'
  },

});