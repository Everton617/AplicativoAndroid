import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { prismaClient } from "../../services/db"
import { Image } from 'react-native';
import { ToastAndroid } from 'react-native'
import { Prisma } from '@prisma/client';

interface data {
  
  id: number;
  nome: string;
  quantidade: number;
  preco: Prisma.Decimal;
  disponivel: boolean;

}

export function FormTask() {
  const [produto, setProduto] = useState("")
  const [quantidade, setQuantidade] = useState(0)
  const [preco, setPreco] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [produtos, setProdutos] = useState<data[]>([]);

  useEffect(() => {
   
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      const produtosData = await prismaClient.estoque.findMany();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Error fetching products:", error);
      ToastAndroid.showWithGravity(
        'Erro ao buscar produtos. Tente novamente.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }

  async function handleNovoProduto() {
    const parsedPreco = parseFloat(preco.replace(',', '.')); 

    if (produto === "" || quantidade <= 0 || isNaN(parsedPreco) || parsedPreco <= 0) {
      let mensagem = 'Preencha todos os campos corretamente.';
      if (quantidade <= 0) {
        mensagem = 'A quantidade deve ser maior que 0.';
      } else if (isNaN(parsedPreco) || parsedPreco <= 0) {
        mensagem = 'O preço deve ser um número maior que 0.';
      }
      ToastAndroid.showWithGravity(mensagem, ToastAndroid.SHORT, ToastAndroid.TOP);
      return;
    }

    try {
      const produtoExistente = await prismaClient.estoque.findFirst({
        where: { nome: produto }
      });

      if (produtoExistente) {
        ToastAndroid.showWithGravity(
          'Já existe um produto com este nome.',
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        );
        return;
      }


      await prismaClient.estoque.create({
        data: {
          nome: produto,
          disponivel: true,
          quantidade: quantidade,
          preco: parsedPreco, 
        },
      });

      fetchProdutos();
      setModalVisible(false)
      setProduto('')
      setQuantidade(0)
      setPreco(''); 
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      ToastAndroid.showWithGravity(
        'Erro ao adicionar produto. Tente novamente.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.container} >
        <Image style={styles.logo} source={require('../../../assets/logotipo.png')} />

        <Pressable style={styles.buttonAdd} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
          <Ionicons name="add" size={24} color="#FFF" />
        </Pressable>

      </View>

      <Modal
        animationType="slide" 
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible); 
        }}
      >


        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <View style={styles.header} >
              <Text style={styles.title}>Adicionar novo Produto</Text>
              <AntDesign style={{ marginTop: 5 }} name="shoppingcart" size={24} color="black" />
            </View>

            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
              <Text style={{ fontSize: 16, paddingBottom: 10, paddingRight: 5 }}>Insira um nome:</Text>
              <TextInput
                placeholder="Digite um produto..."
                value={produto}
                onChangeText={setProduto}
                style={styles.input}
              />
            </View>

            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, paddingBottom: 10, paddingRight: 5 }}>Insira a quantidade:</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Digite a quantidade..."
                value={quantidade.toString()}
                onChangeText={text => setQuantidade(Number(text))}
                style={styles.input}
              />
            </View>

            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, paddingBottom: 10, paddingRight: 5 }}>Insira um preço:</Text>
              <TextInput
                placeholder="Digite o preço..."
                value={preco}
                onChangeText={setPreco} 
                keyboardType="decimal-pad" 
                style={styles.input}
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.button, styles.buttonSave]} onPress={handleNovoProduto}>
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
  logo: {
    width: 250,
    height: 200,
  },
  input: {
    width: 140,
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
    width: 170
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
    elevation: 5, 
  },
  modalButtonContainer: { 
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