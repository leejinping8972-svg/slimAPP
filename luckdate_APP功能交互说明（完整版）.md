Instrucciones interactivas con todas las funciones de la aplicación #luckdate (versión completa)

> **Nombre del producto:** luckdate
> **Versión:** V2.0
> **Fecha:** 2026-07-24
> **Alcance:** Funciones e interacciones visibles para el usuario (descripción comercial pura, excluida la implementación técnica)
> **Paquete:** `PRD-luckdate.md`, cada `规则-*.md`, `文档索引.md`
> **Nota:** La copia de la interfaz está principalmente en inglés; este artículo utiliza chino simplificado para describir la interacción. Algunos datos de la versión de demostración son simulaciones, pero las rutas y reglas son las que se describen en el producto completo.

---

## Tabla de contenido

1. [Objetivos del producto y circuito cerrado central] (n.º 1: objetivos del producto y circuito cerrado central)
2. [Identidad del usuario y estado del producto](#2-Identidad del usuario y estado del producto)
3. [Estructura de navegación principal](#3-Estructura de navegación principal)
4. [Ruta de activación y registro de nuevo usuario (detallada)] (#4-Detalles de la ruta de activación y registro de nuevo usuario)
5. [Ruta del usuario que regresa](#5-Ruta del usuario que regresa)
6. [Dos enlaces abiertos por el plan] (#6-Dos enlaces abiertos por el plan)
7. [Instrucciones de interacción de funciones página por página] (#7-Instrucciones de interacción de funciones página por página)
8. [Capas elásticas entre páginas y componentes compartidos](#8-Capas elásticas entre páginas y componentes compartidos)
9. [Ruta de aceptación de un extremo a otro](#9-Ruta de aceptación de un extremo a otro)
10. [Descripción de demostración y marcador de posición](#10-Descripción de demostración y marcador de posición)

---

## 1. Objetivos del producto y circuito cerrado central

Con el compañerismo **Sunny** como núcleo, luckdate organiza los siguientes circuitos cerrados:

1. Los nuevos usuarios completan la orientación, el registro, los pedidos asociados (opcional) y la creación de archivos.
2. Luego de calificar para el producto, inicie el plan Slim (reemplazo de comidas por 28 días, o atención sin reemplazo de comidas)
3. Registre y vea el progreso en Journey/Sunny/Plan todos los días
4. Recompras de la Guía del día 28 según los resultados

**Principio básico: Se requiere la calificación del producto antes de comenzar el programa de reemplazo de comidas de 28 días. **
Compra exitosa ≠ inicio del plan (las compras dentro de la aplicación requieren confirmación de recepción antes de ingresar al Día 1).

---

## 2. Identidad del usuario y estado del producto

### 2.1 Identidad

| Identidad | Alcance accesible |
|------|------------|
| **Visitante** | Abrir pantalla, guiar, iniciar sesión, registrarse, asociar pedidos (después del registro) |
| **No se ha creado un nuevo registro** | Basado principalmente en archivos de chat de Sunny; puedes ingresar al shell principal para navegar de acuerdo con las reglas |
| **Usuario perfilado** | Todas las funciones del shell principal (muestra diferencias según el estado del producto) |

**Restricciones de acceso:**

- Los visitantes primero deben pasar por la apertura de la pantalla → orientación, y luego ingresar al registro/iniciar sesión (no se permiten enlaces profundos para omitir la orientación y registrarse directamente, a menos que el producto acuerde lo contrario).
- No puedes ingresar a las principales funciones de chat diarias de Journey / Mall / Me / Plan / Sunny sin iniciar sesión.
- Después de haber iniciado sesión y completado la creación del perfil, ingresará automáticamente a Journey (o Sunny si no ha creado un perfil) cuando acceda a la pantalla de apertura/inicio de sesión/registro.

### 2.2 Estado del producto (afecta la mayoría de la visualización de páginas)

| Estado del producto | Significado | Diferencias típicas de interfaz |
|--------|------|--------------|
| **Sin producto** | No asociado / omitido / sin titulación válida | Guía de compra de planes; Viaje sin hitos completos |
| **Pendiente de recibo** | Se ha comprado un sustituto de comida en la aplicación, pero no se ha confirmado el recibo | Hay varias entradas de "confirmar recibo"; el plan no se ha iniciado |
| **Reemplazo de comidas en progreso** | El Slim Journey de 28 días ha comenzado | Día x/28, tareas de hoy, hitos |
| **Cuidado de reemplazo no alimentario** | Vinculado a productos que no son sustitutos de comidas | Recordatorio de servicio diario; sin hito completo de 28 días |

---

## 3. Estructura de navegación principal

Después de iniciar sesión e ingresar al shell principal, **navegación inferior 4 elementos**:

| Barra inferior | Página | Descripción |
|------|------|------|
| **Sunny** | Chat en pantalla completa | Después de ingresar, **Oculta la barra inferior**; regrese a la esquina superior izquierda para regresar a Journey |
| **Viaje** | Descripción general de vitalidad/ritual | Barra inferior permanente |
| **Centro comercial** | Lista de centros comerciales | Barra inferior permanente |
| **Yo** | Centro personal | Barra inferior permanente |

**El plan (plan de 28 días) no figura en la columna inferior. **La entrada incluye:

- Tarjeta "Tu plan" en la parte superior de Journey
- Mi menú contextual "Plan"
- Botones de acción como "Ver mi plan" en mensajes de Sunny
- Página de introducción del plan después de una compra exitosa desde la aplicación

Cuando hace clic en Viaje en la barra inferior, si se encuentra actualmente en la página de segundo nivel del Plan, seguirá estando en el mismo estado de navegación seleccionado (Viaje todavía está resaltado visualmente).

---

## 4. Ruta de activación y registro de nuevo usuario (detalles)

Este capítulo es la **ruta principal oficialmente requerida para nuevos usuarios** y se deben aceptar todos los bucles cerrados.

### 4.1 Diagrama de flujo general

```
【Pantalla de inicio】~2 segundos, sin interacción
    ↓ transición en la misma pantalla
【Bienvenida】Feel Alive. Meet luckdate.
    ├─ «Log in» ──────────────────→【Inicio de sesión】→ Journey (recurrente; ver capítulo 5)
    └─ «Start My Journey»
            ↓
        【Registro】teléfono o correo electrónico
            ↓ correcto: otorgar cupón de bienvenida de $5
        【Asociar pedido】nombre del cliente + últimos 4 dígitos del teléfono
            ├─ Asociación correcta (sustituto de comida) → activar Día 1 de inmediato
            ├─ Asociación correcta (otro producto) → modo de cuidado del producto
            ├─ Asociación fallida → mostrar soporte; reintentar u omitir
            └─ «Skip for now» → sin producto
            ↓
        【Chat de Sunny · primera vez】
            · Presentación y capacidades de Sunny
            · Si hay pedido asociado: producto + invitación al plan
            · Preguntas de perfil (ver 4.6)
            ↓ perfil completado
        【Shell principal disponible】
            · Sustituto de comida activo → Sunny guía el check-in del Día 1
            · Sin producto → Plan/Journey muestran orientación de compra
```

### 4.2 Abrir pantalla

| Artículo | Descripción |
|----|------|
| Presentación | Imagen de estilo de vida en pantalla completa/ambiente de marca |
| Duración | Aproximadamente **2 segundos**, no puede hacer clic para omitir durante este período (el producto se puede personalizar por separado) |
| Resultado | **Misma página** cambia al contenido de la página de la guía (no es necesario abrir otra ruta) |

### 4.3 Página de inicio

**Presente:**

- Imagen de fondo de pantalla completa o vídeo en bucle (puede ser una imagen estática brevemente antes de cargar)
- Logotipo de la marca/súper símbolo
- Copia principal: `Feel Alive. Meet luckdate.`
- Dirección de redacción de tarjetas pequeñas con forma de cristal: Cada gran día comienza con un pequeño ritual.
- Botón principal: `Start My Journey`
- Botón secundario: `Log in`
- Puede haber puntos de paginación en la parte inferior (decoración)

**funcionar:**

| Operación | Resultado |
|------|------|
| Comience mi viaje | Marcar como haber visto la guía → Entrar **Registrarse** |
| Iniciar sesión | Marcar como haber visto la guía → Ingresar **Iniciar sesión** |

**Restricciones:** Los visitantes que no hayan visto la guía no pueden ir directamente al registro/iniciar sesión a través del enlace profundo (primero deben regresar a la pantalla de inicio/guía).

### 4.4 Página de registro

**Presente:**

- avatar Sunny
- Título: Crea tu cuenta (o equivalente)
- Cambio de canal: **Número de teléfono móvil/correo electrónico** (elige uno de los dos)
- Cuadro de entrada correspondiente
- Botón principal: Crear cuenta / Continuar
- Puede cambiar para iniciar sesión

**Operación y Verificación:**

| Operación | Resultado |
|------|------|
| Cambiar teléfono móvil/correo electrónico | Cambiar área de entrada y borrar mensajes de error |
| Enviado pero el formato no es válido | Mensaje de error en la página, quédate en esta página |
| Envío exitoso | **Cupón de bienvenida de $5 emitido (30 días)** → Ingrese **Pedido asociado** |
| Volver | Volver a la guía (o flujo de pantalla) |

**Descripción del negocio:**

- El entorno formal debe contar con una verificación de cuentas real; el ambiente de demostración puede ser relajado.
- La página del certificado de regalo registrado (que muestra la tarjeta de cupón) es **opcional**; la ruta principal puede ser "ingresar directamente el pedido asociado" y el cupón es visible en Mall/Me.

### 4.5 Página de pedido asociada

**Presente:**

- Título: Vincula tu pedido
- Instrucciones: utilice **Nombre del cliente (destinatario) + últimos cuatro dígitos del número de teléfono móvil** para buscar
- Si se ha emitido un cupón de bienvenida: se puede mostrar el mensaje del cupón
- Entrada: nombre del destinatario, últimos 4 dígitos del teléfono
- Operación principal: consultar/obtener información del producto
- Operaciones: `Skip for now`
- Después de la consulta: pedido/lista de productos o mensaje de error

**funcionar:**

| Operación | Resultado |
|------|------|
| El nombre está vacío/los últimos cuatro dígitos no son 4 dígitos | Mensaje de verificación, no enviar |
| Consulta realizada con éxito · Sustitución de comidas incluida | Vinculación exitosa → **Abrir inmediatamente durante 28 días Día 1** → Ingrese a Sunny (presentación del producto + creación de perfil) |
| Consulta exitosa · Sólo sustitutos no alimentarios | Ingrese al modo de cuidado del producto → Perfil Sunny |
| Consulta exitosa · Múltiples productos | Visualización de lista; si se incluye sustituto de comida, se activará como sustituto de comida |
| Consulta fallida | Mensaje no encontrado, comuníquese con el servicio de atención al cliente; puedes volver a intentarlo o saltar, **no bloqueado** |
| Saltar por ahora | Sin productos → Perfil Sunny |
| Volver | Volver al registro (nuevo usuario) |

**NO HACER:** Sincronizar el historial de chat privado o las etiquetas privadas.

### 4.6 Sunny entra por primera vez (introducción + creación de archivo)

**Formato:** Chat en pantalla completa (sin barra inferior). El contenido de la introducción se coloca en el mensaje de chat, **no** una introducción separada de tres páginas a la ruta principal.

#### 4.6.1 Mensaje de apertura (sin pedido / Saltar)

Sunny envió:

1. Preséntate
2. Descripción de la capacidad (Ritual diario, Vitalidad, complemento de recetas, centro comercial, etc.)
3. Solicitud de consentimiento de exención de privacidad y salud

#### 4.6.2 Mensaje de apertura (orden asociada)

Además de la descripción de la habilidad, agregue:

- Llamar al usuario por su nombre
- Tarjetas/listas de productos asociados (la etiqueta de reemplazo de comidas se desbloquea en 28 días; la etiqueta de reemplazo de alimentos es cuidado diario)
- Botón de acción **Invitación al proyecto**, por ejemplo:
- Obtener plan (continuar creando un archivo para obtener el plan)
- Sólo ayuda del producto
- Sólo navegando
-Ahora no

Seleccione Obtener plan (o equivalente) para ingresar a las preguntas y respuestas del perfil.

#### 4.6.3 Secuencia de preguntas y respuestas del archivo

| Pasos | ¿Qué preguntó Sunny? Acciones del usuario | Reglas especiales |
|------|--------------|----------|----------|
| Privacidad | ¿Está de acuerdo con la declaración de privacidad y salud? Responder con el texto o botón de consentimiento | Si no está de acuerdo, no podrá continuar creando un archivo |
| Edad | Rango de edad | Haga clic o responda | **Menores de 18 años: Interceptado**, el plan de adelgazamiento no se puede activar |
| Altura | Valor (en unidades regionales) | Entrar | — |
| Peso | Peso actual | Entrada | El sistema puede dar un peso objetivo sugerido |
| Peso objetivo | Objetivo o "recomendación de uso" | Entrar/confirmar | — |
| Comidas | Desayuno/Almuerzo/Cena, etc. | Haga clic | ¿Qué comida utiliza el usuario de reemplazo de comidas para reemplazar?
| Recordatorio | Hora del recordatorio | Ingrese como 08:00 | Puede configurar un recordatorio nocturno para reemplazar comidas |

La barra de respuesta rápida cambia con la pregunta actual.

#### 4.6.4 Creación de archivo completada

- Sunny muestra la descripción del plan de 28 días (resumen de cuatro fases) o la descripción que coincide con el estado del producto.
- Ejemplos de botones de acción: `Start Day 1 Ritual`, `View My Plan`, `Go to Ritual`, etc.
- **Si se ha activado el plan de reemplazo de comidas:** Se agregó una guía ritual del día 1 (ir a Ritual/Recordar beber agua/Recordar comidas/Recordar dormir, etc.).
- Una vez completada la creación del archivo, Journey mostrará el módulo "Sugerencias diarias".

### 4.7 Comparación del estado final de la nueva rama de usuario

| Sucursal | Asociación | Estado del producto después de la creación | Siguiente comportamiento típico |
|------|------|--------------|----------------|
| Un | Reemplazo de comidas exitoso | Reemplazo de comidas en progreso Día 1 | Registro guiado en Sunny → Viaje/Plan |
| B | Éxito en sustitución de alimentos no alimentarios | Cuidados sustitutivos no alimentarios | Recordatorio de toma diaria; puede actualizar para comprar un sustituto de comida |
| C | Saltar/Continuar después del error | Sin producto | Guía de compra de planos; pueden realizar pedidos a través del Mall |
| D | Cualquiera + Menores de 18 | La pérdida de peso no se puede activar | Recordatorio de seguridad, pare en el estado final adecuado |

---

## 5. Devolver la ruta del usuario

```
Pantalla de inicio → Bienvenida → Log in →【Inicio de sesión】
  → correcto → Journey (conservar estado de producto y progreso anteriores)
```

| Operación | Resultado |
|------|------|
| Correo electrónico/teléfono móvil + Credenciales enviadas correctamente | Ingrese al viaje |
| Fallido | Error en la página, dejado al iniciar sesión |
| Corte al registro | Ingresar a la página de registro |

El entorno de demostración puede relajar la verificación; el entorno formal requiere una autenticación real.

---

## 6. Dos enlaces abiertos por el plan.

### 6.1 Enlace A: Asociación de orden de canal externo → Inmediato Día 1

Aplicable: se compró externamente y puede proporcionar el nombre + los últimos cuatro dígitos.

1. Complete el enlace en la página de pedido asociada o Yo→Pedidos
2. Reconocido como sustituto de una comida → **inmediatamente** Día 1
3. Plan/Viaje muestra en progreso

### 6.2 Enlace B: Compra dentro de la aplicación → Día 1 después de la confirmación de recepción

Aplicable: Compre productos calificados para reemplazar comidas (como Solar Protein) en el Centro Comercial.

1. Detalles del producto → Comprar ahora
2. **Pagar:** El sistema verifica automáticamente el cupón de bienvenida apropiado y el usuario puede cancelarlo.
3. Pago exitoso → **recibo por confirmar** (el plan aún no ha comenzado)
4. Haga clic en **Confirmar recibo** en la página de introducción Plan/Yo/Viaje/Plan.
5. Active el Día 1 y **salte a la página Plan en curso**

---

## 7. Instrucciones de interacción de funciones página por página

Lo siguiente se enumera en la página a la que ingresará el usuario: **Representación · Acción · Resultado · Diferencia de estado**.

---

### 7.1 Abrir pantalla/arrancar

Consulte [4.2](#42-Pantalla abierta), [4.3](#43-Página de guía).

---

### 7.2 Página de inicio de sesión

**Presentación:** Área de encabezado de bienvenida; teléfono móvil/correo electrónico y formulario de credencial; botón principal Iniciar sesión; abajo para registrarse.

**funcionar:**

| Operación | Resultado |
|------|------|
| Iniciar sesión Éxito | Ingrese al viaje |
| Fracaso | Mensaje de error |
| Ir a registro | Página de registro |
| Volver | Página de guía |

---

### 7.3 Página de registro

Consulte [4.4](#44-Página de registro).

---

### 7.4 Registro exitoso de la página de certificado de regalo (evitar)

**Presentación:** Copia de bienvenida; Tarjeta de cupón de $5 (alcance, período de validez); botón "Continuar asociando pedido" o "Ver cupón".

**Descripción:** La ruta principal puede omitir esta página; si está habilitado, el botón principal ingresa el pedido asociado.

---

### 7.5 Página de pedido asociada

Consulte [4.5](#45-Página de pedidos asociada).

---

### 7.6 Página de chat de Sunny (pantalla completa)

**Ingrese:** Sunny en la columna inferior; o la ruta del archivo principal; o "Iniciar sesión a través de Sunny" en cada página, etc.

**Presente:**

- Barra superior: Sunny AI Chat, Volver, Más (Más puede ser un marcador de posición)
- Lista de mensajes: Usuario/Burbuja Sunny; puede contener tarjetas de sugerencias de productos y botones de acción
- Acceso directo "Quizás quieras preguntar"
- Cuadro de entrada + copia breve del descargo de responsabilidad sobre el estilo de vida

**funcionar:**

| Operación | Resultado |
|------|------|
| Enviar texto | Sunny responde; si es intención de check-in, escribir el registro de hoy y confirmar |
| Haga clic en el acceso directo | Complete o envíe la oración preestablecida directamente |
| Haga clic en el botón de acción Ver mi plan | Ingresar plano |
| Haga clic en Ir al ritual / Inicio del día 1 | Ingrese al viaje |
| Haga clic en Registrar agua/comida/dormir | Graba o abre rápidamente el proceso correspondiente |
| Volver | Volver al viaje (o página anterior) |

**Diferencia de estado:**

- Indocumentado: basado principalmente en una guía de preguntas y respuestas
- Día de reemplazo de comidas ≥ 28 y no has visto el informe: Puedes jugar Journey Complete → Ir al informe / Más tarde
- Contenido de alto riesgo: respuesta segura, no continúe con los consejos normales de pérdida de peso (ver documento de reglas)

---

### 7.7 Journey (Página de inicio de la Ceremonia de Vitalidad)

**Propósito:** Vitalidad integral, tendencias, sugerencias diarias, entrada de check-in y entrada del Plan.

**Zona superior:**

- Título / Compartir (Se puede compartir)
- Ingrese a la entrada del chat de Sunny

**Módulos y Operaciones:**

| Módulos | Contenido | Operaciones |
|------|------|------|
| Tu tarjeta Plan | Según cambios de estado del producto | Haga clic para abrir → Planificar; al recibir la mercancía, Confirmar → Plan en curso |
| **Recomendaciones diarias** | Calorías/Proteínas/Agua Potable + Sugerencias de Hábitos | **Solo se muestra si está archivado**; si no se archiva, no aparecerá el bloque completo |
| Cambio de rango de tiempo | Hoy / 28 / 56 / 84 Días | Cambio de ventanas de energía y tendencias |
| Puntuación de vitalidad integral | Anillo de puntuación, cambio respecto a ayer | Puntos de información → Tarjeta de sugerencias Sunny |
| Tendencia de puntuación | Polilínea | Ventana de tendencias conmutable |
| Desmantelamiento en seis dimensiones | Nutrición / Ejercicio / Mindfulness / Sueño / Hidratación / Hábitos, etc. | Los hábitos, etc. pueden entrar en Sunny |
| Enfoque de hoy | Temas del carrusel | Ver plan de enfoque → Tarjetas de sugerencias |
| Registro de check-in | Entrada de facturación | → Página de registro de check-in |
| Calendario de coherencia | Estado de finalización de los últimos días | Haga clic en un día determinado → Detalles de ese día superpuestos |
| Tendencia de peso | Mostrar cuando hay datos disponibles | — |
| Barra para compartir | — | Puede ocupar espacio |

**Diferencia de estado del producto (Tarjeta Plan):**

| Estado | Rendimiento de la tarjeta |
|----|----------|
| Reemplazo de comidas en progreso | Progreso del día x/28, haga clic en Planificar |
| Pendiente de confirmación de recepción | Panel de confirmación de recepción |
| Sin productos | Guía para comprar / visitar el centro comercial |
| No es un sustituto de una comida | Instrucciones de cuidado, pueden guiar las actualizaciones |

---

### 7.8 Plan (Nivel 2 · No ingrese a la columna inferior)

**Barra superior:** Regreso (normalmente Viaje), título Plan de 28 días, icono de calendario (puede tener lugar).

**Pestaña:** En progreso / Mis planes (si hay una Biblioteca de planes, puede ser del tipo visualización).

#### En curso

**A. Pendiente de confirmación de recepción**

- Redacción: Esperando entrega
- `Confirm Receipt & Start Plan` → Día de activación 1 → Esta página cambia a En progreso (o se actualiza a En progreso)
- `View Plan Overview` → Página de introducción del plan

**B. Reemplazo de comidas en progreso**

- Héroe: nombre del plan, día x/28, hito
- Detalles del plan → Informe del día 28 disponible (cerca del final)
- Tareas de hoy (puedes hacer clic para registrarte): Peso / Comida nutricional / Beber agua / Dormir, etc.
- Narrativa de etapa: Kickstart → Adaptación → Mejora → Consolidación
- Herramientas del plan: la guía de dieta/entrenamiento/meditación, etc. se puede utilizar como entrada de exhibición

**DO. Sin producto**

- Guía de compra de Proteína Solar
- Comprar Producto → Detalles del producto
- Proporcionar número de pedido → Pedido asociado
- Explorar centro comercial / Descartar

**D. Cuidados no sustitutivos de comidas**

- Hora del recordatorio y si tomarlo hoy.
- Se le puede guiar al centro comercial para actualizar el Slim Journey completo

#### Mis planes

- Hay un reemplazo de comida en progreso: cambie la tarjeta nuevamente a En progreso
- Sin plan: descripción de estado vacía

---

### 7.9 Introducción al plan

**Presentación:** Instrucciones de cuatro etapas de 28 días, descripción general de las tareas pendientes diarias.

| Estado | Botón principal |
|------|--------|
| Pendiente de confirmación de recepción | Confirmar recibo e iniciar plan → **Plan en progreso** |
| Otros | Ir al Plan / Ir al Ritual |

---

### Centro comercial 7.10 (centro comercial)

**Presente:**

- Imagen de encabezado y título Centro comercial
- Cuadro de búsqueda (puede ser de solo lectura)
- Cuando no se utiliza el cupón de bienvenida: un banner que indica "el pago se aplicará automáticamente"
- Filtrado de series: Todas, Adelgazamiento / Belleza / Envejecimiento Saludable / Mujer / Mente / Energía / Vitalidad Diaria, etc.
- Ficha de producto de doble columna → Detalles
- Cuando Día ≥ 28: Puede aparecer el chip "próxima dirección del viaje", haga clic para ingresar al producto o filtro correspondiente

**Operación:** Haga clic en producto → detalles del producto; haga clic en filtro → lista de filtros.

---

### 7.11 Página de detalles del producto

**Presente:**

- Devolver, compartir (puede ocupar espacio), cantidad del carrito de compras (se puede indicar localmente)
- Área de héroe del carrusel, precio, colección.
- Selección de especificaciones (como 28/56/instalación de prueba)
- Términos de servicio, detalles, ingredientes, uso, advertencias.
- Barra inferior: atención al cliente (puede ocupar espacio), carrito de compras, Agregar al carrito, Comprar ahora

**Comprar ahora:**

| Condición | Resultado |
|------|------|
| Sin productos + productos sustitutivos de comidas | Abrir pago: seleccionar cupones automáticamente (se pueden cancelar) → Confirmar compra → Aviso de éxito → Introducción del plan (para recibir) |
| En espera de recepción + mismo producto | Ingrese a la introducción del plan |
| Otros productos/planes existentes | Espacio de demostración inmediata u orden general (según normas oficiales) |

**Agregar al carrito:** Cantidad local +1 + aviso (ingrese el carrito de compras para realizar el pago en el entorno oficial).

**Interacción de pago (clave):**

- Mostrar subtotal, cambio de cupón de bienvenida (activado de forma predeterminada), pago real
- Confirmar compra → proceso de pago exitoso
- Cancelar → Cerrar, no consumir cupones

---

### 7.12 Página Registro de entrada (Registro de entrada)

**Presentación:** Cambio antes y después de la fecha; Resumen de ingesta diaria, ejercicio, sueño, lista de comidas, agua potable, análisis nutricional; Metas ajustables de calorías/ejercicio.

**funcionar:**

| Operación | Resultado |
|------|------|
| Cambiar fecha | Datos del día de cambio (los días históricos se pueden dejar vacíos) |
| Iniciar sesión a través de Sunny Chat | Entra Sunny |
| Consejo | Ingrese la tarjeta de sugerencias de Sunny |

---

### 7.13 Página de tarjeta de sugerencias de Sunny

**Entrada:** Información sobre el viaje, plan de enfoque, acciones de chat, consejos de registro, etc.

**Presentación:** Fecha y día de viaje; pancarta temática; lista de tareas sugeridas + Completa; Consejo/frase de oro de hoy; comentarios sobre si es útil (puede ser local).

**Operación:** Completa → Regresar al viaje más.

---

### 7.14 Página de informe del día 28

**Entrada:** Detalles del plan, ventana emergente de Sunny Day28 "Ver informe", etc.

**Presente:**

- Completa el título y el icono del ritual.
- Plenitud, días activos, cambios de vitalidad.
- mensaje de Sunny
- **Tarjeta del próximo viaje:** Presione A/B/C para mostrar el título y la descripción.

**funcionar:**

| Operación | Resultado |
|------|------|
| Botón principal (Renovar compra actual / Mantener estabilidad / Ver reemplazo) | Ingrese los detalles del producto correspondiente |
| Explorar más | Ingresar al centro comercial |
| Ahora no | Volver |

Consulte `规则-开通复购与优惠券.md` para la determinación A/B/C.

---

### 7.15 Yo (Centro Personal)

**Presente:**

- Área de avatar: apodo, copia de miembro, subtítulo del estado del plan
- Resumen de vitalidad: puntos diarios,% Ritual,% Consistencia, etc.
- Menú rápido: Check-in, Pedidos, Cupones, Recordatorios, Centro comercial, Plan
- Al recibir la mercancía: Tarjeta de Entrega Pendiente + Confirmar Recibo → **Plan Jump**
- Membresía / Resumen de viaje
- Configuración: Unidades, Idioma (solo lectura), Recordatorios, Privacidad
- Órdenes y logros: números de pedidos asociados, insignias y cupones restantes
- Tarjeta de entrada al centro comercial
- Cerrar sesión (si corresponde)

**Resumen de operación:**

| Entrada | Resultados |
|------|------|
| Registro | Página de registro de check-in |
| Pedidos | Página de pedidos asociados |
| Cupones | Superposición/lista de cupones (estado, días restantes, ir al centro comercial) |
| Recordatorios | Página de configuración de recordatorio |
| Centro comercial | Centro comercial |
| Plano | Página del plano |
| Confirmar recibo | Activar Día1 → Planificar |
| Cerrar sesión | Volver a iniciar sesión |

---

### 7.16 Página de configuración de recordatorio

**Presentación:** Exhibir de 1 a 2 veces según el estado del producto.

| Tipo de usuario | Se pueden configurar recordatorios |
|----------|----------|
| Reemplazo de comidas | Desayuno + cena (o dos tramos personalizados) |
| No es un sustituto de comida/sin productos | Recordatorio diario único |

**Operación:** Cambiar hora → Guardar → Volver; la copia se divide en "Registro de reemplazo de comidas/Productos de toma/Estado del registro".

---

### 7.17 Página de guía de formulario antiguo (omitir)

Formulario de varios pasos: Bienvenido → Privacidad → Retrato → Comida → Recordatorio → Listo.

**Nota:** La ruta principal oficial para nuevos usuarios se ha cambiado a archivado de diálogos de Sunny; Esta página es sólo para depurar o ingresar al historial. El acceso debe redirigirse a Journey una vez completada la creación de perfiles.

---

### 7.18 Página de presentación de producto independiente (bypass)

Si todavía hay una página separada: después de mostrar los puntos de venta del producto, Continuar → Sunny.

**Ruta principal oficial:** La introducción del producto se completa en Sunny Chat y no es necesario pasar por esta página.

---

## 8. Capas elásticas entre páginas y componentes compartidos.

| Componente | Posición de aparición | Puntos de interacción |
|------|----------|----------|
| Panel de recepción pendiente | Viaje / Plan / Yo / Introducción | Confirmar → Día1 → Planificar |
| Registro en la hoja inferior | Planifique las tareas de hoy y los detalles del día del viaje | Enviar y escribir el registro de hoy |
| Báscula de peso | Flujo de facturación | El rango predeterminado es alrededor del peso actual, se puede ampliar |
| Cuadro de diálogo Viaje completo | Sunny (Día≥28) | Ver informe / Ahora no |
| Hoja de cupones | Yo | Consulta el estado, ve al centro comercial |
| Hoja de pago | Detalles del producto Comprar ahora | El cupón automático se puede cancelar |
| Hoja de detalles del día | Calendario de viaje | Ver el resumen del registro de un día determinado |

**Reglas generales para capas elásticas:** La capa elástica pull-up debe cubrir el riel inferior; la altura debe ser operable.

---

## 9. Ruta de aceptación de un extremo a otro

### Ruta A: vinculación de orden abierta directamente Día 1

Abra la pantalla → Orientación → Registro → Reemplazo de comida asociado con éxito → Introducción a Sunny + creación de perfil → Orientación del día 1 → Viaje/Plan muestra el día 1

### Ruta B: omitir el pedido y activar compras dentro de la aplicación

Abra la pantalla → Guía → Registrarse → Saltar asociación → Perfil Sunny → Centro comercial → Detalles de reemplazo de comidas → Pagar (vale) → Recibo pendiente → Confirmar → **Plan en curso**

### Ruta C — Visita de regreso

Arranque → Iniciar sesión → Viaje → (opcional) Plan

### Ruta D - Recompra del día 28

Usuarios de reemplazo de comidas hasta el Día 28 → Ventana emergente Sunny o Plan → Informe → botón principal A/B/C para ingresar productos

### Ruta E: módulo sugerido

Sin perfil: Viaje **No** sugerencias diarias → Actualizar después de completar el perfil: **Sí** Sugerencias diarias

### Ruta F: no se bloquea si falla la asociación

Registrarse → Aviso de error de asociación → Saltar o continuar → Perfil de Sunny → No hay productos para visitar el centro comercial

---

## 10. Instrucciones de demostración y marcador de posición

Es conveniente que los revisores distingan entre "requisitos completos" y "simplificación de la demostración actual":

| Proyectos | Prácticas comunes de demostración | Requisitos completos |
|------|--------------|--------------|
| Iniciar sesión/Registrarse | Puede relajar la verificación | Cuenta real y control de riesgos |
| Asociación de pedidos | Palabras clave/nombre de la demostración | Biblioteca de pedidos reales + límite de frecuencia |
| Pago | Simulación exitosa | Cupón de pago y reembolso real |
| Sunny | Reglas/Respuesta de muestra | Actuar según las reglas de intención + la seguridad es lo primero |
| Fecha histórica de entrada | Completa solo hoy | Historial disponible |
| Compartir/Atención al cliente/Buscar | Puede no responder | Implementar u ocultar antes de conectarse |
| Unidades/Idioma | Sólo lectura | Bloquear unidades por región; idioma configurable |

---

## Documentos asociados

- [Índice de documentación](./文档索引.md)
- [PRD-luckdate.md](./PRD-luckdate.md)
- `规则-开通复购与优惠券.md` (no existe actualmente en el repositorio)
- [Reglas de diálogo y enrutamiento de intenciones de Sunny](./规则-Sunny对话与意图路由.md)
- [Reglas de registro diario y puntuación](./规则-每日记录与评分.md)

---

*luckdate Instrucciones interactivas con todas las funciones (versión completa) V2.0 · 2026-07-24*
