import { View, Text, StyleSheet, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Estoque } from '@prisma/client'
import { prismaClient } from '../../services/db';
import { Ionicons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Decimal } from '@prisma/client/runtime/react-native';

interface Props {
  data: {
    id: number;
    nome: string;
    quantidade: number;
    preco: Decimal;
    disponivel: boolean;
  };
}


export function TaskList({ data }: Props) {
  const [produto, setProduto] = useState("")
  const [quantidade, setQuantidade] = useState(0)
  const [preco, setPreco] = useState< string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);


  async function handleDeleteTask() {
    await prismaClient.estoque.delete({
      where: {
        id: data.id
      }
    })
  }

  async function handleUpdateStatus() {
    await prismaClient.estoque.update({
      where: {
        id: data.id
      },
      data: {
        disponivel: false,
        quantidade: 0
      }
    })
  }

  async function handleUpdateProduto(id: number) {
    const parsedPreco = typeof preco === 'string' ? parseFloat(preco) : preco;

    if (produto === "" || quantidade === 0 || isNaN(parsedPreco)) return;

    console.log('Atualizando')

    await prismaClient.estoque.update({
      where: { id },
      data: {
        nome: produto,
        quantidade: quantidade,
        preco: parsedPreco,

      }
    })

    if (quantidade <= 0) {
      await prismaClient.estoque.update({
        where: { id },
        data: { disponivel: false },
      })

    } else {
      await prismaClient.estoque.update({
        where: { id },
        data: { disponivel: true },
      })
    }

    setModalVisible(false)

    setProduto("")
    setQuantidade(0)
    setPreco('')
    Keyboard.dismiss()

  }

  useEffect(() => {
    
    if (modalVisible) {
      setProduto(data.nome);
      setQuantidade(data.quantidade);
      setPreco(data.preco.toString());
    }
  }, [modalVisible]);

  useEffect(() => {
    
    if (searchQuery === "") {
      setFilteredData(data); 
    } else {
      const filtered = Object.values({ data }).filter((item: any) =>
        item.nome.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
      setFilteredData(filtered[0]);

    }


  }, [searchQuery, data]);



  return (
    
   
     <View >
       
        <View style={styles.container}>
          <View style={styles.infoarea}>
            <Text>Nome</Text>
            <Text>Quantidade</Text>
            <Text>Preço</Text></View>
          {filteredData && (
            <View style={styles.info}>
              <Text style={styles.text}>{filteredData.nome}</Text>
              <Text style={styles.text}>{filteredData.quantidade}</Text>
              <Text style={styles.text}>R$ {filteredData.preco.toString()}</Text>
            </View>
          )}
          {!filteredData && <Text>Nenhum produto encontrado.</Text>}
          <View style={styles.buttons}>
            <Pressable style={styles.buttonDelete} onPress={handleDeleteTask}>
              <Ionicons name="trash-outline" size={16} color="#FFF" />
            </Pressable>
            <Pressable style={styles.buttonUpdate} onPress={() => setModalVisible(true)}>
              <MaterialIcons name="update" size={16} color="#FFF" />
            </Pressable>
            {data.disponivel && (
              <Pressable style={styles.buttonEsgotado} onPress={handleUpdateStatus}>
                <MaterialCommunityIcons name="close-circle-outline" size={16} color="black" />
              </Pressable>
            )}
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
                  <Text style={styles.title}>Atualizar Produto:</Text>
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
                  <Pressable style={[styles.button, styles.buttonSave]} onPress={() => handleUpdateProduto(data.id)}>
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
     </View>
   
  );
}

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: "#64748b",
    marginBottom: 30,
    padding: 14,
    borderRadius: 4,
  
  },
  infoarea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  text: {
    fontWeight: "500",
    color: "#FFF"
  },
  buttons: {
    position: "absolute",
    bottom: -18,
    flexDirection: "row",
    right: 0,
    zIndex: 99,
    gap: 8,
  },
  buttonDelete: {
    backgroundColor: "#ef4444",
    padding: 6,
    borderRadius: 99,
  },
  buttonUpdate: {
    backgroundColor: "blue",
    padding: 6,
    borderRadius: 99,
  },
  buttonEsgotado: {
    backgroundColor: "#ecd927",
    padding: 6,
    borderRadius: 99,
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
})