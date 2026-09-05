# TechInventory - Módulo Backend (API REST)

Este repositorio alberga la API RESTful de **TechInventory**, encargada del procesamiento de lógica de negocio, control transaccional de stock, autenticación y comunicación con la base de datos.

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** Java 21 / OpenJDK
* **Framework:** Spring Boot (Spring Web, Spring Data JPA, Spring Security)
* **Gestor de Dependencias:** Maven
* **Base de Datos:** PostgreSQL (AWS RDS / Local)

## 📋 Requisitos Previos

* JDK 21 o superior instalado y configurado en las variables de entorno.
* Apache Maven instalado.
* Instancia local o remota de PostgreSQL activa.

## ⚙️ Ejecución en Desarrollo

1. Configura la cadena de conexión a la base de datos en `src/main/resources/application.properties`.
2. Compila e inicia la aplicación ejecutando en la raíz de la carpeta backend:

```bash
./mvnw spring-boot:run

