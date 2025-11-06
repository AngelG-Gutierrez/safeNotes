import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Sizes } from '../../../constants/theme';
import { Note } from "../notes/entities/note";
import { ModalComponentPrin } from "../notes/modal";
import { ServiceNote } from "../notes/services/serviceNote";

export function HomePage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showAddNote, setShowAddNote] = useState<boolean>(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const noteService = new ServiceNote();

    const loadNotes = async () => {
        try {
            const fetchedNotes = await noteService.listNotes();
            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Failed to load notes:", error);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const truncateText = (text: string | null | undefined, maxWords: number) => {
        if (!text) return ''; 
        const normalizedText = text.replace(/\s+/g, ' ').trim();
        const words = normalizedText.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return normalizedText;
    };

    // Abrir modal con nota seleccionada (modo edición)
    const handlePress = (note: Note) => {
        setSelectedNote(note);
        setShowAddNote(true);
    };

    // Guardar nueva nota o actualizar existente
    const handleSaveNote = async (note: Note) => {
        try {
            if (selectedNote) {
                // Editar
                await noteService.updateNote({
                    ...selectedNote,
                    title: note.title,
                    content: note.content,
                });
            } else {
                // Crear
                await noteService.addNote(note.title, note.content);
            }
            await loadNotes();
            setShowAddNote(false);
            setSelectedNote(null);
        } catch (error) {
            console.error("Failed to save note:", error);
        }
    };

    const handleDeleteNote = async (note: Note) => {
        try {
            await noteService.delete(note.id);
            await loadNotes();
            setShowAddNote(false);
            setSelectedNote(null);
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };


    const renderItem = ({ item }: { item: Note }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardPreview}>
                    {truncateText(item.content, 3) || 'Sin vista previa...'}
                </Text>
                <Text style={styles.cardDate}>
                    {item.lastEdited ? new Date(item.lastEdited).toLocaleDateString('es-ES') : ''}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <View>
                        <View style={styles.logoRow}>
                            <Image
                            source={require('../../../assets/images/iconLogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                            />
                            <Text style={styles.headerName}>SafeNotes</Text>
                        </View>
                    <Text style={styles.headerNoteCount}>{notes.length} Notas</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            setSelectedNote(null);
                            setShowAddNote(true);
                        }}
                    >
                        <Feather name="plus" size={24} color={Colors.light.background} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.projectTitle}>Tus Notas</Text>

                <FlatList
                    data={notes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: Sizes.cardSpacing }} />}
                />
            </View>

            <ModalComponentPrin
                isVisible={showAddNote}
                onCancel={() => {
                    setShowAddNote(false);
                    setSelectedNote(null);
                }}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
                note={selectedNote}
            />
        </SafeAreaView>
    );
}

// 5. EL STYLESHEET ACTUALIZADO
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background, // Fondo de pantallas
    },
    container: {
        flex: 1,
        marginHorizontal: Sizes.screenMargin, // Márgenes de Pantalla
        paddingTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.headerListSpacing, // Entre Cabecera y Lista
    },
    headerName: {
        fontFamily: Fonts.base, // Texto Base (Fechas)
        fontSize: Sizes.h2, // 16px
        color: Colors.light.text, // Negro Principal
        fontWeight: 'bold', // Negrita
    },
    headerNoteCount: {
        fontFamily: Fonts.base, // Texto Base
        fontSize: Sizes.base, // 16px
        color: Colors.light.text, // Negro Principal
    },
    addButton: { // Estilo del Botón + (Icono de Cabecera)
        width: 48,
        height: 48,
        borderRadius: 24, // Circular
        backgroundColor: Colors.light.tint, // fondo Azul Corporativo
        justifyContent: 'center',
        alignItems: 'center',
        // sombra suave
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    projectTitle: {
        fontFamily: Fonts.h2, // Título de Nota en Lista (H2)
        fontSize: Sizes.h2, // 20px
        color: Colors.light.text, // Negro Principal
        marginBottom: Sizes.cardSpacing, // 16px (espacio entre tarjetas)
    },
    // Estilos de Tarjeta de Nota
    card: {
        backgroundColor: Colors.light.background, // Fondo de tarjetas
        borderWidth: 1,
        borderColor: Colors.light.border, // Borde de tarjetas de nota
        borderRadius: 8, // Basado en mockups (p. 7)
        padding: Sizes.cardPadding, // Padding de Tarjetas
    },
    cardTitle: {
        fontFamily: Fonts.h2, // Fuente: Montserrat
        fontSize: Sizes.h2, // Tamaño: 20px
        color: Colors.light.text, // Negro Principal
        marginBottom: 4,
    },
    cardPreview: {
        fontFamily: Fonts.base, // Fuente: Open Sans Regular
        fontSize: Sizes.base, // Tamaño: 16px
        color: Colors.light.text, // Negro Principal
        marginBottom: 12,
    },
    cardDate: {
        fontFamily: Fonts.base, // Fuente: Open Sans Regular
        fontSize: Sizes.base, // Tamaño: 16px
        color: Colors.light.text, // Negro Principal
        // anclada a la esquina inferior derecha
        alignSelf: 'flex-end',
    },
    logo: {
        width: 25,
        height: 25,
        marginRight: 8,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
});