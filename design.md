# Diseño — luckdate / ChatViva Slim

Un sistema de diseño bloqueado para esta aplicación Flutter. Cada rediseño visual lee esto
archivo antes de emitir cambios en la interfaz de usuario. No regenerar un nuevo tema por página.
amplíe o modifique este archivo cuando el sistema necesite crecer.

/* Hallmark · género: editorial · sistema-de-diseño: design.md · diseñado-como-aplicación
* bloqueado: colores de la marca · logotipo · supersímbolo · Avatar de Sunny · flujos de interacción
 */

## Bloqueado (no cambiar)

- **Colores de marca**: todos los `LuckdateColors` valores hexadecimales en `mobile/lib/app/theme/luckdate_theme.dart`
- **Logotipo** — `assets/images/logo.png` / uso de la marca denominativa
- **Supersímbolo**: uso de activos de supersímbolo del proyecto
- **IP Sunny** — `LdSunnyAvatar` / recursos de humor Sunny y comportamiento de los personajes
- **Interacción funcional**: rutas, toques, flujos de autenticación/pedido/plan/chat, intención de copia

## Género

editorial (marca de vitalidad suave: acento sobrio en papel)

## Familia de macroestructuras

- Páginas de marketing/lanzamiento: columna de texto asimétrico inclinada a letras (Bienvenidos ya)
- Páginas de shell de la aplicación: Workbench — encabezado → superficie primaria → listas secundarias
- Chat: conversacional: avatar + pila de burbujas, acciones como controles de ancho completo

## Tema (mapa de color bloqueado)

Mapa de papel/tinta/acento en tokens Flutter existentes: **los valores no deben variar**:

| Rol | Ficha de aleteo |
|------|----------------|
| papel | `cloudIvory` `#FFF9F5` |
| papel-2 / superficie | `ivoryWhite` `#FFFFFF` |
| tinta | `textPrimary` `#2C3A2E` |
| tinta-2 | `textSecondary` `#7A6E62` |
| regla | `lineSoft` `#E8DFD4` |
| acento | `deepSage` `#5E6B45` |
| acento suave | `sageSoft` `#E8EFE0` |
| acento secundario | `sunGold` `#D4A853` (≤ 5% de ventana gráfica) |

## Tipografía

- Familia: **Montserrat** únicamente (fuente del proyecto: bloqueada)
- Pantalla / H1: w600–w700, seguimiento más estrecho (−0,3 a −0,6)
- Cuerpo: w400, 15/22
- Título/pestaña: w500–w600, ligero +seguimiento
- **Sin encabezados en cursiva**

## Espaciado

Escala de 4 puntos vía `LuckdateSpacing` (xs 4 → xxl 32). Prefiere tokens con nombre; Evite los números mágicos en la nueva interfaz de usuario.

## Radio (rediseñado)

| Ficha | Valor | Uso |
|-------|-------|-----|
| controlar | 14 | botones, entradas, chips |
| médico | 12 | pequeñas superficies |
| LG | 16 | burbujas, tarjetas medianas |
| XL | 18 | tarjetas primarias (antes 20+) |
| hoja | 24 | sábanas bajeras |
| pastilla | 999 | mangos / pastillas verdaderas solamente (raro) |

Prefiera **control** a la píldora completa para CTA principales.

## Profundidad

- Tarjetas predeterminadas: borde fino + **sin** sombra paralela intensa (o solo 0/1px suave)
- Elevar solo para hojas flotantes/compositores
- Sin morfismo de vidrio, sin brillo multicapa

## Movimiento

- Corto: 200–220 ms; suavizar
- Selección de navegación: solo opacidad/fundido cruzado de color
- Respetar el movimiento reducido cuando esté disponible.

## voz de llamada a la acción

- Primario: relleno `deepSage`, etiqueta blanca, radio **control**, altura 52
- Secundario: relleno de marfil, borde de regla suave, etiqueta de tinta, mismo ritmo de radio/altura
- Chips seleccionados: relleno de salvia + etiqueta blanca (misma familia)

## Microinteracciones

- Se prefiere el éxito silencioso (SnackBar solo cuando es necesario)
- Enfoque: anillo de salvia / borde 1.5 en entradas
- Botones de acción de chat: objetivos de ancho completo, apilados y fáciles de tocar (≥ 48)

## Asignaciones por página

- Marketing (Bienvenido): puede conservar foto de estilo de vida + bloqueos de marca
- Páginas de aplicaciones: sin enriquecimiento decorativo; La función lleva la página.
- Chat: avatar de Sunny sin cambios; El cromo burbuja puede refinar

## ¿Qué páginas DEBEN compartir?

- Fichas de colores arriba
-Montserrat
- Logotipo/súper símbolo/activos Sunny
- Voz CTA (radio de control + sabio primario)
- Etiquetas y destinos de navegación inferiores

## ¿En qué páginas PUEDEN diferir?

- Relleno de sección y densidad de lista.
- Filas de cartas vs color
- Alineación del encabezado dentro del shell
- Ubicación de ilustración local (no reemplaza a Sunny)

## Mapeo de aleteo

- Los tokens viven en `mobile/lib/app/theme/luckdate_theme.dart`
- Chrome compartido en `mobile/lib/core/widgets/ld_components.dart` + `ld_shell.dart`
