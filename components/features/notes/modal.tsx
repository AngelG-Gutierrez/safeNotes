import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Sizes } from '../../../constants/theme';
import { Note } from './entities/note';

interface ModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onSave: (note: Note) => void;
    onDelete?: (note: Note) => void;
    note: Note | null;
}

export const ModalComponentPrin: React.FC<ModalProps> = ({
    isVisible,
    onCancel,
    onSave,
    onDelete,
    note,
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    const showToast = (message: string) => {
        setToastMessage(message);
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => setToastMessage(null));
    };

    const handleSave = () => {
        const safeTitle = title.trim();
        const safeContent = content.trim();

        if (!safeTitle && !safeContent) {
            onCancel();
            return;
        }

        onSave({
            id: note ? note.id : 0,
            title: safeTitle || 'Sin título',
            content: safeContent,
            iv: note ? note.iv : '',
            lastEdited: new Date(),
        });

        setTitle('');
        setContent('');

        onCancel();
        setTimeout(() => showToast('Nota guardada'), 300);
    };

    const handleDelete = () => {
        if (note && onDelete) {
            Alert.alert(
                'Eliminar nota',
                '¿Seguro que quieres eliminar esta nota?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: () => {
                            onDelete(note);
                            onCancel();
                            setTimeout(() => showToast('Nota eliminada'), 300);
                        },
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const handleCancel = () => {
        onCancel();
        setTitle('');
        setContent('');
    };

    return (
        <>
            <Modal
                transparent={false}
                visible={isVisible}
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <SafeAreaView style={styles.modalScreen}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                        style={styles.container}
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                            <Ionicons name="close" size={28} color={Colors.light.text} />
                        </TouchableOpacity>

                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.inputTitle}
                                placeholder="Título de nota"
                                placeholderTextColor={Colors.light.border}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <TextInput
                                style={styles.inputBody}
                                placeholder="Texto de la nota"
                                placeholderTextColor={Colors.light.border}
                                value={content}
                                onChangeText={setContent}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            {note && onDelete && (
                                <TouchableOpacity
                                    style={[styles.buttonBase, styles.buttonDanger]}
                                    onPress={handleDelete}
                                >
                                    <Text style={styles.buttonText}>Eliminar</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.buttonBase, styles.buttonSave]}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>

            {toastMessage && (
                <Animated.View
                    style={[
                        styles.toastContainer,
                        { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
                    ]}
                >
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
        </>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    modalScreen: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: Sizes.screenMargin,
        paddingTop: 16,
    },
    inputTitle: {
        fontFamily: Fonts.h1,
        fontSize: Sizes.h1,
        color: Colors.light.text,
        marginBottom: Sizes.editorSpacing,
    },
    inputBody: {
        flex: 1,
        fontFamily: Fonts.base,
        fontSize: Sizes.base,
        color: Colors.light.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: Sizes.screenMargin,
        justifyContent: 'space-between',
    },
    buttonBase: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    buttonDanger: {
        backgroundColor: Colors.light.danger,
    },
    buttonSave: {
        backgroundColor: Colors.light.success,
    },
    buttonText: {
        fontFamily: Fonts.base,
        fontSize: Sizes.base,
        color: Colors.light.background,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 16,
        zIndex: 10,
        padding: 10,
    },
    toastContainer: {
        position: 'absolute',
        top: '45%',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
    },
    toastText: {
        color: '#fff',
        fontFamily: Fonts.base,
        fontSize: Sizes.base,
        textAlign: 'center',
    },
});
