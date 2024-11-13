import { StyleSheet, FlatList, TextInput, Text } from 'react-native';
import { prismaClient } from '../../services/db';
import { TaskList } from './list';
import { useEffect, useState } from 'react';
interface data {
  
    id: number;
    nome: string;
    quantidade: number;
    preco: number;
    disponivel: boolean;

}

export function Estoque({ filter }: { filter: boolean }) {
  const [estoque, setEstoque] = useState<data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadEstoque() {
      const data = await prismaClient.estoque.findMany({
        where: {
          disponivel: !filter
        }
      });
      setEstoque(data);
    }
    loadEstoque();
  }, [filter]);


  const filteredEstoque = searchQuery === ""
    ? estoque
    : estoque.filter(item =>
      item.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

 return (
   <>
    <TextInput
        placeholder="Pesquisar produto..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
    <FlatList
      data={filteredEstoque}
      keyExtractor={ (item) => String(item.id) }
      renderItem={ ({ item }) => <TaskList data={item} /> }
      
    />
   </>
  );
}

const styles = StyleSheet.create({
searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10, 
  },
})