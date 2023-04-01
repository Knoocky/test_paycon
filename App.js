import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { readString } from 'react-native-csv';
import DocumentPicker from 'react-native-document-picker';

const urlList = ['https://paycon.su/api1.php', 'https://paycon.su/api2.php'];

function fetchData() {
  return Promise.all([
    fetch(urlList[0]).then(response => response.json()),
    fetch(urlList[1]).then(response => response.json())
  ]).then(response => {
    return response;
  })
}

// Не работает. Ввыдаёт ошибку [TypeError: Cannot read property 'pick' of null]. Всю голову уже сломал, не могу понять почему так
//
// async function importData() {
//   try {  
//     const res = await DocumentPicker?.pick({
//       type: [DocumentPicker.types.csv],
//     });
//     const result = readString(res[0].uri);
//     console.log(result);
//   } catch (err) {
//     console.warn(err);
//   }
// }

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const handleButton = (type) => {
    if (type === 'api') {
      setIsLoading(true)
      fetchData().then(response => {
        const result = response[0].concat(response[1]);
        setDataList(result);
        setIsLoading(false);
      });
    }
    if (type === 'csv') {
      // importData();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button title='Загрузить из API' onPress={() => handleButton('api')}/>
        <Button title='Загрузить из файла' onPress={() => handleButton('csv')} />
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        {dataList.map(item => {
          return (
            <View key={item.id} style={styles.listItemView}>
              <Text>{item.name}</Text>
              <Text>{item.price}</Text>
            </View>
        )})}
      </ScrollView>
      <Modal visible={isLoading}>
        <View style={styles.container}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large"/>
            <Text>Загрузка...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 100,
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
  listItemView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 4,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  }
});
