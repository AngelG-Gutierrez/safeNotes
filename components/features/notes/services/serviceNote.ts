import { DataSource } from "../data/dataSource";
import { Note } from "../entities/note";

export class ServiceNote {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource();
  }

  async listNotes(): Promise<Note[]> {
    try {
        return await this.dataSource.getNotes();
    } catch (error) {
        console.error("Error al listar notas:", error);
        throw error;
    }
  }

  async addNote(title: string, content: string): Promise<void> {
    try {
        return await this.dataSource.saveNote({ title, content});
    } catch (error) {
        console.error("Error al agregar nota:", error);
        throw error;
    }
  }

  async updateNote(note: Note): Promise<void> {
    try {
        // Llama a saveNote CON ID para ACTUALIZAR
        return await this.dataSource.saveNote({
            ...note,
            lastEdited: new Date() // Actualiza la fecha de edición
        });
        } catch (error) {
        console.error("Error al actualizar nota:", error);
        throw error;
    }}

    async delete(id: number): Promise<void> {
      try {
          return await this.dataSource.deleteNote(id);
      } catch (error) {
          console.error("Error al eliminar nota:", error);
          throw error;
      }
    }
}