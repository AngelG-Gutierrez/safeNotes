import { supabase } from "@/config/supabase";
import { decryptText, encryptText } from "../../auth/encryptation"; //Funciones de cifrado/descifrado
import { Note } from "../entities/note";

export class DataSource {
    // Obtiene notas y las desencripta antes de mostrarlas
    async getNotes(): Promise<Note[]> {
        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .order("lastEdited", { ascending: false });

        if (error) {
            console.error("Error fetching notes:", error);
            return [];
        }

        // Desencriptar cada nota
        const decryptedNotes = await Promise.all(
            (data as Note[]).map(async (note) => {
                try {
                    const decryptedContent = await decryptText(note.content, note.iv);
                    return { ...note, content: decryptedContent };
                } catch (err) {
                    console.error("Error decrypting note:", err);
                    return { ...note, content: "[Error al desencriptar]" };
                }
            })
        );

        return decryptedNotes;
    }

    // Guarda notas cifradas
    async saveNote(note: { title: string; content: string; id?: number; lastEdited?: Date }): Promise<void> {
        try {
            const { cipher, iv } = await encryptText(note.content);

            const { error } = await supabase.from("notes").upsert({
                ...note,
                content: cipher, // guarda el texto cifrado
                iv: iv, // guarda el vector de inicialización este es necesario para descifrar
            });

            if (error) {
                console.error("Error saving note:", error);
            }
        } catch (err) {
            console.error("Error encrypting note:", err);
        }
    }

    // Elimina una nota
    async deleteNote(id: number): Promise<void> {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (error) {
            console.error("Error deleting note:", error);
        }
    }
}
