import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { migrate } from '../db/database';
import * as notes from '../services/noteService';

export default function Home() {
  const [list, setList] = useState<notes.Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const load = () => setList(notes.getAll());

  useEffect(() => { 
    migrate(); 
    load(); 
  }, []);

  const save = () => {
    if (title.trim().length < 3) {
      Alert.alert('Validasi', 'Judul minimal 3 karakter');
      return;
    }
    if (editId) {
      notes.update(editId, title, content);
    } else {
      notes.create(title, content);
    }
    setTitle(''); 
    setContent(''); 
    setEditId(null); 
    load();
  };

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 56 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Catatan Kuliah</Text>
      <TextInput 
        placeholder='Judul' 
        value={title} 
        onChangeText={setTitle} 
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} 
      />
      <TextInput 
        placeholder='Isi catatan' 
        value={content} 
        onChangeText={setContent} 
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} 
      />
      <Button title={editId ? 'Simpan Perubahan' : 'Tambah'} onPress={save} />
      
      <FlatList
        data={list}
        keyExtractor={n => String(n.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.content}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              <Button title='Edit' onPress={() => { 
                setEditId(item.id); 
                setTitle(item.title); 
                setContent(item.content); 
              }} />
              <Button title='Hapus' onPress={() => { 
                notes.remove(item.id); 
                load(); 
              }} />
            </View>
          </View>
        )}
      />
    </View>
  );
}