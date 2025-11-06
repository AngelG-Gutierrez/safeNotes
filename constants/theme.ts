
/**
 * Colores de la app basados en la Guía de Estilo SafeNotes.
 */

// Color primario de la guía
const primaryColor = '#0047AB'; // Azul Corporativo [cite: 32]

export const Colors = {
  light: {
    // Colores definidos en la guía 
    text: '#212529',           // Negro Principal
    background: '#FFFFFF',     // Blanco Puro
    tint: primaryColor,          // Azul Corporativo
    border: '#CED4DA',           // Gris Neutro
    success: '#28A745',          // Verde Guardar
    danger: '#DC3545',           // Rojo Alerta

    // Roles genéricos (inferidos de la guía)
    icon: '#212529',           // (Usamos Negro Principal)
    tabIconDefault: '#CED4DA',   // (Usamos Gris Neutro)
    tabIconSelected: primaryColor,
  },
  dark: {
    // Tema oscuro (Sugerido, no está en la guía)
    text: '#ECEDEE',
    background: '#151718',
    tint: primaryColor, // Mantenemos el azul corporativo
    border: '#343a40',
    success: '#28A745',
    danger: '#DC3545',
    
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryColor,
  },
};

/**
 * Fuentes de la app (Guía de Estilo SafeNotes)
 * * Nota: La estructura que proveíste (sans, serif, mono) es para fuentes
 * semánticas del sistema. Tu guía de estilo define fuentes
 * por CASO DE USO (H1, H2, Base) que deben ser cargadas
 * con expo-font.
 * * Por lo tanto, usamos esta estructura para que coincida con la guía:
 */
export const Fonts = {
  h1: 'Montserrat_700Bold',   // Título de Editor (H1) [cite: 36]
  h2: 'Montserrat_400Regular', // Título de Nota en Lista (H2) [cite: 40]
  base: 'OpenSans_400Regular', // Texto Base (Párrafos y Controles) [cite: 44]
};

/**
 * Tamaños y Espaciado (Guía de Estilo SafeNotes)
 */
export const Sizes = {
  // Tamaños de fuente
  h1: 40, // [cite: 37]
  h2: 20, // [cite: 41]
  base: 16, // [cite: 45]

  // Márgenes y Padding
  screenMargin: 16,     // Márgenes de Pantalla [cite: 90]
  cardPadding: 16,      // Padding de Tarjetas [cite: 91]
  modalPadding: 20,     // Padding de Modal [cite: 92]

  // Espaciado vertical
  headerListSpacing: 24, // Entre Cabecera y Lista [cite: 94]
  cardSpacing: 16,      // Entre Tarjetas de Nota [cite: 95]
  editorSpacing: 12,    // En Editor (Formulario) [cite: 96]
  
  // Espaciado horizontal de botones
  buttonEditorSpacing: 16, // Entre botones del editor [cite: 99]
  buttonModalSpacing: 12,  // Entre botones del modal [cite: 100]
};

// Exportación combinada
export default { Colors, Fonts, Sizes };