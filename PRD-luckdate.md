# PRD — luckdate

> **Versión:** V2.0
> **Fecha:** 2026-07-24
> **Estado:** Pendiente de revisión del equipo
> **Nombre del producto:** luckdate
> **Alcance:** Interacción funcional y requisitos comerciales (excluida la implementación técnica)
> **Paquete:** Ver `文档索引.md`

---

## 1. Resumen

luckdate es una aplicación que utiliza el asistente de inteligencia artificial **Sunny** para acompañar a los usuarios a establecer hábitos saludables. Los usuarios pueden asociar el pedido comprado a través de "nombre del cliente + últimos cuatro dígitos del teléfono móvil", o después de comprar en el centro comercial y confirmar el recibo, iniciar el **Slim Journey de reemplazo de comida de 28 días**. Consulte el portal de sugerencias y progreso en Journey todos los días y complete la grabación y la orientación en el diálogo Sunny; el día 28, la orientación de recompra se dividirá según el efecto.

---

## 2. Contactos

| Nombre | Rol | Comentar |
|------|------|---------|
| (A completar) | Productos | Exige toma de decisiones y aceptación |
| (A completar) | Diseño | Interfaz y experiencia de conversación Sunny |
| (para completar) | I+D | Implementado según documentos comerciales |
| (para completar) | Operaciones | Configuración de cupones, commodities y reglas de recompra |
| (A completar) | Servicio al cliente | Asistencia en caso de fallo de asociación, comodidad del usuario |
| (para completar) | Cumplimiento | Reclamaciones de Salud y Límites de Alto Riesgo |

---

## 3. Antecedentes

### 3.1 ¿Qué es esto?

luckdate conecta "productos de reemplazo de comidas/salud comprados" y "cómo usarlos y persistir todos los días" en una sola experiencia: primero confirme las calificaciones del producto, luego ingrese un viaje ejecutable de 28 días, use Sunny para reducir los costos de persistencia y, al final, naturalmente conducirá a la siguiente compra.

### 3.2 ¿Por qué hacerlo ahora?

- Se han completado transacciones entre canales externos y dominios privados, pero los usuarios carecen de una entrada unificada de uso y acompañamiento.
- Es necesario realizar el registro, los pedidos asociados, el check-in diario y el final de la recompra en un circuito cerrado que pueda ser aceptado.
- La versión demo ha verificado que la ruta principal es accesible; Los requisitos formales deben basarse en una interacción comercial completa y los pasos no se pueden omitir según la demostración.

### 3.3 Formularios de productos finalizados

- Cuatro elementos en la columna inferior: **Sunny · Journey · Mall · Me**; **El plan no ingresa en la columna inferior** (ingrese desde Journey / Me / Sunny).
- La introducción del producto de Sunny se coloca en **Primera vez que ingresa al chat** y no hay una introducción independiente a la ruta principal de la página.
- Días de viaje: **28 días** (no 30 días).
- Mercado: Primer lanzamiento en Estados Unidos, sincronizado en México (las unidades y redacción son por región).

---

## 4.Objetivo

### 4.1 Metas

Permitir que los usuarios que hayan comprado sustitutos de comidas adquieran el hábito de "grabar diariamente + compañía Sunny" dentro de los 28 días, y ser guiados claramente al siguiente paso apropiado de recompra una vez finalizado; permita a los usuarios que no han comprado experimentar las capacidades básicas primero y luego completar la primera compra y activar el plan.

### 4.2 Valor para la empresa y los usuarios

- **Usuario:** Sepa qué hacer hoy, recuérdelo suavemente y no se confunda después del final.
- **Empresa:** Se pueden verificar las calificaciones de los pedidos, se pueden operar viajes y se pueden configurar reglas de recompra.

### 4.3 Resultados clave (recomendado, calibrar después de que la línea de base esté en línea)

| KR | Métricas | Recomendaciones de objetivos |
|----|------|----------|
| KR1 | Los usuarios recién registrados completan "pedidos asociados" o "compras dentro de la aplicación y confirman el recibo" | ≥ 40% (30 días después de conectarse) |
| KR2 | Los usuarios de sustitutos de comidas han completado el Ritual al menos 4 días antes del día 7 | ≥ 50% |
| KR3 | Los usuarios que llegan al Día 28 hacen clic en el botón principal de recompra | ≥ 25% |
| KR4 | El cupón de bienvenida se utiliza dentro de los 30 días posteriores a su validez | ≥ 15% |

---

## 5. Segmento(s) de mercado

Divida por tareas a realizar, no por datos demográficos puros.

| Agrupación | Cosas por lograr | Formulario de producto |
|------|------------|----------|
| Sustitutivos de comidas adquiridos en canales externos | Probar compra y empezar inmediatamente | Asociación exitosa → Ingrese al plan de 28 días inmediatamente |
| Primera compra de sustituto de comida en la aplicación | Espere hasta que llegue la mercancía antes de comenzar | Pago exitoso → Pendiente de confirmación de recibo → Día 1 después de la confirmación |
| Productos sustitutivos distintos de las comidas adquiridos | Recuerda usar productos todos los días | Recordatorio de cuidado del producto (sin hito completo de 28 días) |
| Aún no comprado | Comprenda primero, registre primero y luego decida comprar | Chat básico y grabación + orientación de compra |
| Menores/grupos de alto riesgo | Seguridad le dijo que no son aptos para este programa | Interceptado y no dado consejos radicales sobre pérdida de peso |

**Restricciones:** Consejos sobre estilo de vida, sin diagnóstico médico; Unidades de Estados Unidos/México y particiones de redacción de cumplimiento.

---

## 6. Propuesta(s) de valor

| Ganancias de usuario | Dolor evitado |
|----------|------------|
| El pedido está sujeto a las calificaciones del plan. Una vez que lo compres, sabrás cómo usarlo | "No sé cómo usarlo después de comprarlo. No sé cuándo empezar". |
| Sunny completa la introducción, la creación de archivos y los registros diarios con una sola entrada | Cambiar entre múltiples aplicaciones y múltiples formularios |
| Journey tiene sugerencias diarias basadas en datos personales | "Nadie puede decir cuánto debes comer o beber hoy" |
| Day28 da diferentes direcciones de recompra según el efecto | Después del final, la ventana está vacía y los productos se envían aleatoriamente |
| Regístrese para obtener un cupón de $5, que se entregará automáticamente al realizar un pedido (se puede cancelar) | Los descuentos son difíciles de encontrar y se olvidan de utilizarlos |

En relación con "centro comercial puro" o "robot de chat puro": luckdate enfatiza una cadena comercial de **calificación → viaje → registro → recompra**.

---

## 7.Solución

### 7.1 Arquitectura principal de navegación y información

| Entrada | Tipo | Qué hace el usuario aquí |
|------|------|------------------|
| **Sunny** | Chat en pantalla completa después de ingresar a la barra inferior (no se muestra la barra inferior) | Conozca a Sunny, cree archivos, grabe conversaciones diarias, haga clic en el botón de acción para saltar |
| **Viaje** | Barra inferior | Vea la vitalidad y las tendencias actuales, vea sugerencias diarias, ingrese tarjetas perforadas e ingrese Planificar desde tarjetas |
| **Centro comercial** | Barra inferior | Explore series de productos, ingrese detalles y realice pedidos |
| **Yo** | Barra inferior | Pedidos, cupones, recordatorios, recibo pendiente, acceso rápido al Plan |
| **Planificar** | **Página de segundo nivel, no ingrese a la columna inferior** | Verifique el estado del plan: no activado / pendiente de recibo / en curso / atención de reemplazo no alimentario |

### 7.2 Ruta principal del nuevo usuario (debe ser de circuito cerrado)

```
Pantalla de inicio (~2 segundos)
  → Pantalla de bienvenida
      → «Iniciar sesión» → acceso correcto → Journey (usuario recurrente)
      → «Comenzar mi Journey» → Registro
  → Registro correcto: otorgar cupón de bienvenida de $5 (30 días)
  → Asociar pedido (nombre del cliente + últimos 4 dígitos del teléfono; opcional)
  → Primera entrada a Sunny:
      · Presentación y capacidades de Sunny
      · Si hay pedido asociado: presentación del producto + invitación al plan
      · Perfil: consentimiento de privacidad → edad → estatura → peso → peso objetivo → comidas → hora de recordatorio
  → Perfil completado → funciones principales disponibles
      · Si el plan de sustituto de comida está activo: Sunny guía el Ritual del Día 1
```

| Paso | Resultado exitoso | Fallo o derivación |
|------|----------|------------|
| Registrarse | Inicie sesión, se han emitido cupones, ingrese el pedido asociado | Si la verificación falla, permanezca en la página de registro |
| Vinculado con éxito al reemplazo de comidas | Ingrese inmediatamente al plan de 28 días, Día 1, y luego continúe con la introducción de Sunny y la creación del perfil | — |
| Asociación exitosa con sustitutos no alimentarios | Ingrese al modo de recordatorio de cuidado del producto, luego ingrese a Creación de archivos Sunny | — |
| Asociación fracasó | Solicitud de contacto con el servicio de atención al cliente; se puede volver a intentar u omitir sin bloquear | — |
| Saltar asociación | Sin modo de producto; Plan muestra orientación de compra | — |
| Creación de archivo completada | Journey puede mostrar sugerencias diarias | Los menores de 18 años no pueden activar el plan de adelgazamiento |
| Reemplazo de comida de compra desde la aplicación | Después del pago exitoso, ingrese "Confirmación de recibo pendiente"; después de la confirmación, continúe con el Día 1 e ingrese Plan | Los usuarios pueden cancelar el cupón o darse por vencido antes de confirmar el pago |

**No lo hagas explícitamente:** Utilice la "introducción de tres páginas de Sunny" independiente como página obligatoria para la ruta principal.

### 7.3 Usuarios recurrentes

Página de orientación → Iniciar sesión → Ingrese a Journey directamente y mantenga el último estado y progreso del producto.

### 7.4 Solución para abrir dos enlaces de servicio

| Enlace | Aplicable | ¿Cuándo es el "Día de inicio 1"?
|------|------|----------------------|
| **Pedidos asociados** | Comprado a canales externos | Después de identificarlo como un producto de reemplazo de comidas **Empiece ahora** |
| **Compra desde la aplicación** | Compra de sustitutos de comida en el Centro Comercial | **Comienza después de la confirmación de recepción** (Compra exitosa ≠ Inicio) |

Portal de confirmación de entrega: Plan, Yo, Viaje, aviso de entrega y página de introducción del plan. Después de una confirmación exitosa, **ingrese a la página Plan en progreso**.

Consulte `规则-开通复购与优惠券.md` para obtener más detalles.

### Cupón 7.5 (Resumen comercial)

- Se emitirán $5 tras el registro exitoso, que está disponible en toda la tienda de forma predeterminada (excepto algunos productos, configurados por la operación), y tiene una validez de 30 días.
- **Cancelación:** Solo en la página de confirmación del pedido del producto; el sistema selecciona automáticamente el cupón apropiado y el usuario puede cancelarlo; se considera que ha sido utilizado después del pago exitoso.
- Puedo consultar el estado del cupón y los días restantes.

### 7.6 Sugerencias diarias de viaje

- **Creación de perfil completada** (con información básica sobre el cuerpo y los objetivos): muestra las calorías recomendadas, las proteínas, la ingesta de agua y de 1 a 3 sugerencias de hábitos (cambios según el estado del producto).
- **Creación de perfil no completada: los módulos de sugerencias no se mostrarán. **

### 7.7 Planificar tres estados centrales

1. **No activado:** Guiar compras o proporcionar información del pedido.
2. **Pendiente de confirmación de recibo:** Guía de confirmación de recibo para comenzar a planificar.
3. **En progreso:** Muestra el día x/28, las tareas de hoy y las descripciones de las etapas.

Usuarios que no reemplazan comidas: cuidado del producto (recordatorio de toma diaria), sin hito completo de 28 días; se le puede guiar para que actualice y compre un reemplazo de comida.

### 7.8 Sunny (Resumen comercial)

- Entrada por primera vez: introducir capacidades; introducir productos si hay pedidos; creación completa de archivos.
- Diariamente: registre el uso de productos, agua potable, peso, sueño/estado, dieta, etc.; explicar el progreso; responder preguntas sobre el uso del producto; guía de compras o configuración.
- Escenario de alto riesgo: no continúe con los consejos normales de pérdida de peso, consulte `规则-Sunny对话与意图路由.md`.
- Día 28: Avisar que el viaje se completó → Ingrese el informe y recompra la guía.

### 7.9 Desvío de recompra del día 28 (resumen comercial)

| Sucursales | Condiciones (lenguaje comercial) | Arranque |
|------|------------------|------|
| **A** | Hay efecto de pérdida de peso, pero no se consigue el objetivo | Continuar comprando el producto sustitutivo de comida actual |
| **B** | Hay efecto de pérdida de peso y se ha logrado el objetivo | Compra la siguiente etapa de productos de estabilidad/protección |
| **C** | Básicamente ningún efecto o rebote | Guía para probar productos alternativos |

El botón principal del informe conduce directamente al producto correspondiente; También se puede proporcionar "Visite el centro comercial para ver más".

### 7.10 Registros y calificaciones diarios (Resumen comercial)

Los usuarios registran productos, agua potable, peso, estado, sueño, etc. a través de Journey/Sunny.
**Los puntos de vitalidad** se otorgan por "registros y rituales persistentes", y **no se sumarán ni restarán puntos debido al aumento o disminución de las cifras de peso**.
Consulte `规则-每日记录与评分.md` para obtener más detalles.

### 7.11 Límites de cumplimiento y seguridad

- Menores de 18 años: no se permite el ingreso al programa de adelgazamiento.
- Embarazo/lactancia, medicación para enfermedades crónicas graves, tendencias a trastornos alimentarios, crisis de autolesiones, etc.: dejar de recomendar planes habituales y animarse a buscar ayuda profesional.
- El producto no promete "tratar/curar enfermedades"; no promete resultados específicos de pérdida de peso.

### 7.12 Supuestos (supuestos a verificar)

1. A corto plazo, Solar Protein (o SKU de reemplazo de comidas equivalente) es un producto calificado para el plan de 28 días.
2. Antes de mejorar el sistema logístico, los usuarios podrán "confirmar recibo" manualmente.
3. La lista de productos excluidos del cupón de bienvenida y las reglas de pedido entre EE. UU. y México se pueden configurar por operaciones.
4. La clasificación del día 28 se basa principalmente en la tendencia de peso en relación con el objetivo (la tasa de finalización se puede superponer en el futuro).

---

## 8. Liberación

Fase relativa (calendario no bloqueado):

| Etapa | Ámbito empresarial |
|------|----------|
| **V1 Bida** | Regístrese para emitir cupones, nombre + asociación de los últimos cuatro dígitos, compras dentro de la aplicación que se recibirán y confirmarán →Plan, perfil Sunny y registros diarios, sugerencias de viaje, plan de tres estados, día 28 A/B/C, interceptación de menores |
| **Más tarde** | Se pueden configurar para su aceptación habilidades completas de capas de alto riesgo, reembolsos y cupones, más contenido de productos del siguiente nivel y reglas de backend |
| **No se debe hacer (en este momento)** | Sincronización del historial de chat de dominio privado, dinámica social, entrada del plan en la barra inferior, ruta principal de introducción independiente de tres páginas de Sunny |

---

## 9. Lista de autoverificación de circuito cerrado

| # | Camino | Estado final deseado |
|---|------|----------|
| 1 | Registrarse → Conectar sustituto de comida → Perfil Sunny | El día 1 ha sido activado y puede registrarse |
| 2 | Registrarse → Saltar → Crear perfil → Realizar pedido en el Centro Comercial (usar cupón) → Confirmar recepción | Ingresar Plan en progreso |
| 3 | Registro → Asociación fallida → Continuar | Sin productos, solo comprando y charlando |
| 4 | Volver a visitar iniciar sesión | Ingrese al viaje |
| 5 | Día 28 | Informe + Botón principal A/B/C al producto |
| 6 | No perfilado | Viaje Sin sugerencias diarias |
| 7 | Archivado | Journey tiene sugerencias diarias |

---

## 10. Documentos asociados

- `文档索引.md`
- `luckdate_APP功能交互说明（完整版）.md`
- `规则-开通复购与优惠券.md`
- `规则-Sunny对话与意图路由.md`
- `规则-每日记录与评分.md`
- `规则-管理后台.md`

---

*PRD luckdate V2.0 · Puro negocio · 2026-07-24*
